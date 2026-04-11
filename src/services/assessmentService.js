import { auth, assessmentsCollection, resultsCollection } from '../config/firebase';
import {
  addDoc,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

const assessmentService = {
  saveAssessment: async (formData, results = null, isCompleted = false) => {
    const userId = auth.currentUser?.uid || `guest-${Date.now()}`;

    const assessmentData = {
      userId,
      formData,
      isCompleted,
      timestamp: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    };

    if (results?.cancerRisks) {
      assessmentData.riskScores = results.cancerRisks;
    }

    const docRef = await addDoc(assessmentsCollection, assessmentData);

    if (results) {
      await addDoc(resultsCollection, {
        userId,
        assessmentId: docRef.id,
        recommendations: {
          screenings: results.screenings || [],
          lifestyle: results.lifestyle || [],
          summary: results.summary || '',
        },
        timestamp: serverTimestamp(),
      });
    }

    return docRef.id;
  },

  getLatestAssessment: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;

    const assessmentQuery = query(
      assessmentsCollection,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const snap = await getDocs(assessmentQuery);
    if (snap.empty) return null;

    const assessment = { id: snap.docs[0].id, ...snap.docs[0].data() };

    const recQuery = query(
      resultsCollection,
      where('assessmentId', '==', assessment.id),
      limit(1)
    );

    const recSnap = await getDocs(recQuery);
    const recommendations = !recSnap.empty
      ? recSnap.docs[0].data().recommendations
      : null;

    return { ...assessment, recommendations };
  },
};

export default assessmentService;
