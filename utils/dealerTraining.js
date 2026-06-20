/**
 * 经销商培训学院模块
 * 功能：课程管理、章节学习、测验、证书、培训权限控制
 */

const mockData = require('./mockData.js');

const DEALER_USER_KEY = 'dealer_user';
const TRAINING_PROGRESS_KEY = 'dealer_training_progress';
const TRAINING_QUIZ_RECORDS_KEY = 'dealer_training_quiz_records';
const TRAINING_CERTIFICATES_KEY = 'dealer_training_certificates';

const COURSE_CATEGORIES = {
  PRODUCT: 'product',
  TRACE: 'trace',
  DIVERGENCE: 'divergence',
  BREW: 'brew'
};

const CATEGORY_LABELS = {
  [COURSE_CATEGORIES.PRODUCT]: '产品知识',
  [COURSE_CATEGORIES.TRACE]: '溯源话术',
  [COURSE_CATEGORIES.DIVERGENCE]: '窜货政策',
  [COURSE_CATEGORIES.BREW]: '冲泡演示'
};

const CATEGORY_ICONS = {
  [COURSE_CATEGORIES.PRODUCT]: '📦',
  [COURSE_CATEGORIES.TRACE]: '🔍',
  [COURSE_CATEGORIES.DIVERGENCE]: '🚨',
  [COURSE_CATEGORIES.BREW]: '🍵'
};

const CATEGORY_COLORS = {
  [COURSE_CATEGORIES.PRODUCT]: '#1890FF',
  [COURSE_CATEGORIES.TRACE]: '#52C41A',
  [COURSE_CATEGORIES.DIVERGENCE]: '#FA8C16',
  [COURSE_CATEGORIES.BREW]: '#722ED1'
};

const QUIZ_PASS_SCORE = 60;

function getDealerUser() {
  try {
    return wx.getStorageSync(DEALER_USER_KEY) || null;
  } catch (e) {
    console.error('[DealerTraining] 获取经销商用户失败:', e);
    return null;
  }
}

function getProgress() {
  try {
    return wx.getStorageSync(TRAINING_PROGRESS_KEY) || {};
  } catch (e) {
    console.error('[DealerTraining] 获取学习进度失败:', e);
    return {};
  }
}

function setProgress(progress) {
  try {
    wx.setStorageSync(TRAINING_PROGRESS_KEY, progress);
    return true;
  } catch (e) {
    console.error('[DealerTraining] 保存学习进度失败:', e);
    return false;
  }
}

function getDealerProgressKey() {
  const user = getDealerUser();
  if (!user) return null;
  return user.dealerId + '_' + user.id;
}

function getDealerProgress() {
  const key = getDealerProgressKey();
  if (!key) return { courses: {} };
  const all = getProgress();
  return all[key] || { courses: {} };
}

function setDealerProgress(progress) {
  const key = getDealerProgressKey();
  if (!key) return false;
  const all = getProgress();
  all[key] = progress;
  return setProgress(all);
}

function getQuizRecords() {
  try {
    return wx.getStorageSync(TRAINING_QUIZ_RECORDS_KEY) || {};
  } catch (e) {
    console.error('[DealerTraining] 获取测验记录失败:', e);
    return {};
  }
}

function setQuizRecords(records) {
  try {
    wx.setStorageSync(TRAINING_QUIZ_RECORDS_KEY, records);
    return true;
  } catch (e) {
    console.error('[DealerTraining] 保存测验记录失败:', e);
    return false;
  }
}

function getDealerQuizRecords() {
  const key = getDealerProgressKey();
  if (!key) return {};
  const all = getQuizRecords();
  return all[key] || {};
}

function setDealerQuizRecords(records) {
  const key = getDealerProgressKey();
  if (!key) return false;
  const all = getQuizRecords();
  all[key] = records;
  return setQuizRecords(all);
}

function getCertificates() {
  try {
    return wx.getStorageSync(TRAINING_CERTIFICATES_KEY) || {};
  } catch (e) {
    console.error('[DealerTraining] 获取证书失败:', e);
    return {};
  }
}

function setCertificates(certs) {
  try {
    wx.setStorageSync(TRAINING_CERTIFICATES_KEY, certs);
    return true;
  } catch (e) {
    console.error('[DealerTraining] 保存证书失败:', e);
    return false;
  }
}

function getDealerCertificates() {
  const key = getDealerProgressKey();
  if (!key) return [];
  const all = getCertificates();
  return all[key] || [];
}

function setDealerCertificates(certs) {
  const key = getDealerProgressKey();
  if (!key) return false;
  const all = getCertificates();
  all[key] = certs;
  return setCertificates(all);
}

function getAllCourses() {
  return mockData.getTrainingCourses();
}

function getCourseById(courseId) {
  return mockData.getTrainingCourse(courseId);
}

function getChapterById(courseId, chapterId) {
  const course = getCourseById(courseId);
  if (!course || !course.chapters) return null;
  return course.chapters.find(function(c) { return c.id === chapterId; }) || null;
}

function markChapterStudy(courseId, chapterId, studySeconds) {
  const progress = getDealerProgress();
  if (!progress.courses[courseId]) {
    progress.courses[courseId] = {
      courseId: courseId,
      startTime: Date.now(),
      chapters: {},
      totalStudySeconds: 0,
      completed: false
    };
  }
  const courseProgress = progress.courses[courseId];
  if (!courseProgress.chapters[chapterId]) {
    courseProgress.chapters[chapterId] = {
      chapterId: chapterId,
      firstStudyTime: Date.now(),
      studySeconds: 0,
      completed: false
    };
  }
  const chapterProgress = courseProgress.chapters[chapterId];
  chapterProgress.studySeconds = (chapterProgress.studySeconds || 0) + (studySeconds || 0);
  chapterProgress.lastStudyTime = Date.now();
  
  const chapter = getChapterById(courseId, chapterId);
  if (chapter && chapterProgress.studySeconds >= (chapter.minStudySeconds || 60)) {
    chapterProgress.completed = true;
  }
  
  courseProgress.totalStudySeconds = (courseProgress.totalStudySeconds || 0) + (studySeconds || 0);
  
  checkCourseCompletion(courseId, progress);
  
  setDealerProgress(progress);
  return progress;
}

function checkCourseCompletion(courseId, progress) {
  const course = getCourseById(courseId);
  const courseProgress = progress.courses[courseId];
  if (!course || !courseProgress) return false;
  
  if (!course.chapters || course.chapters.length === 0) return false;
  
  const allChaptersCompleted = course.chapters.every(function(ch) {
    const cp = courseProgress.chapters[ch.id];
    return cp && cp.completed;
  });
  
  if (!allChaptersCompleted) {
    courseProgress.completed = false;
    return false;
  }
  
  if (course.hasQuiz && !isCourseQuizPassed(courseId)) {
    courseProgress.completed = false;
    return false;
  }
  
  courseProgress.completed = true;
  courseProgress.completeTime = Date.now();
  
  if (!hasCourseCertificate(courseId)) {
    issueCertificate(courseId);
  }
  
  return true;
}

function submitQuiz(courseId, answers) {
  const course = getCourseById(courseId);
  if (!course || !course.quiz) {
    return { success: false, error: '课程不存在或无测验' };
  }
  
  const quiz = course.quiz;
  let correctCount = 0;
  const details = [];
  
  quiz.questions.forEach(function(q, idx) {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) correctCount++;
    details.push({
      questionId: q.id,
      question: q.question,
      userAnswer: userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect: isCorrect,
      score: isCorrect ? (q.score || 10) : 0
    });
  });
  
  const totalScore = Math.round(correctCount * (100 / quiz.questions.length));
  const passed = totalScore >= QUIZ_PASS_SCORE;
  
  const record = {
    courseId: courseId,
    score: totalScore,
    passed: passed,
    details: details,
    submitTime: Date.now(),
    submitTimeStr: formatDateTime(Date.now())
  };
  
  const records = getDealerQuizRecords();
  if (!records[courseId]) {
    records[courseId] = [];
  }
  records[courseId].unshift(record);
  setDealerQuizRecords(records);
  
  if (passed) {
    const progress = getDealerProgress();
    checkCourseCompletion(courseId, progress);
    setDealerProgress(progress);
  }
  
  return {
    success: true,
    score: totalScore,
    passed: passed,
    totalQuestions: quiz.questions.length,
    correctCount: correctCount,
    passScore: QUIZ_PASS_SCORE,
    details: details,
    record: record
  };
}

function isChapterCompleted(courseId, chapterId) {
  const progress = getDealerProgress();
  const courseProgress = progress.courses[courseId];
  if (!courseProgress) return false;
  const chapterProgress = courseProgress.chapters[chapterId];
  return !!(chapterProgress && chapterProgress.completed);
}

function isCourseQuizPassed(courseId) {
  const records = getDealerQuizRecords();
  const courseRecords = records[courseId];
  if (!courseRecords || courseRecords.length === 0) return false;
  return courseRecords.some(function(r) { return r.passed; });
}

function isCourseCompleted(courseId) {
  const progress = getDealerProgress();
  const courseProgress = progress.courses[courseId];
  return !!(courseProgress && courseProgress.completed);
}

function hasCourseCertificate(courseId) {
  const certs = getDealerCertificates();
  return certs.some(function(c) { return c.courseId === courseId; });
}

function issueCertificate(courseId) {
  const course = getCourseById(courseId);
  if (!course) return null;
  
  const user = getDealerUser();
  if (!user) return null;
  
  const cert = {
    certId: 'TRAIN_' + courseId + '_' + Date.now(),
    courseId: courseId,
    courseName: course.name,
    category: course.category,
    categoryLabel: CATEGORY_LABELS[course.category],
    userName: user.name,
    dealerName: user.dealerName,
    issueTime: Date.now(),
    issueTimeStr: formatDateTime(Date.now()),
    certNo: 'TRAIN-' + course.category.toUpperCase() + '-' + Date.now().toString().slice(-8),
    issuer: '桂花茶经销商培训学院',
    status: 'valid'
  };
  
  const certs = getDealerCertificates();
  certs.unshift(cert);
  setDealerCertificates(certs);
  
  return cert;
}

function getRequiredCourses() {
  const all = getAllCourses();
  return all.filter(function(c) { return c.isRequired; });
}

function getCompletedRequiredCourseCount() {
  const required = getRequiredCourses();
  return required.filter(function(c) { return isCourseCompleted(c.id); }).length;
}

function hasCompletedAllRequiredCourses() {
  const required = getRequiredCourses();
  return required.every(function(c) { return isCourseCompleted(c.id); });
}

function canPerformStockOut() {
  return hasCompletedAllRequiredCourses();
}

function getTrainingStats() {
  const allCourses = getAllCourses();
  const required = getRequiredCourses();
  const progress = getDealerProgress();
  const certs = getDealerCertificates();
  
  let totalStudySeconds = 0;
  let completedCount = 0;
  
  allCourses.forEach(function(course) {
    const cp = progress.courses[course.id];
    if (cp) {
      totalStudySeconds += cp.totalStudySeconds || 0;
      if (cp.completed) completedCount++;
    }
  });
  
  const completedRequired = getCompletedRequiredCourseCount();
  const totalRequired = required.length;
  
  return {
    totalCourses: allCourses.length,
    completedCourses: completedCount,
    totalRequired: totalRequired,
    completedRequired: completedRequired,
    totalStudySeconds: totalStudySeconds,
    totalStudyMinutes: Math.floor(totalStudySeconds / 60),
    certificates: certs.length,
    canStockOut: canPerformStockOut()
  };
}

function getCourseProgress(courseId) {
  const progress = getDealerProgress();
  return progress.courses[courseId] || null;
}

function getCourseStudySeconds(courseId) {
  const cp = getCourseProgress(courseId);
  return cp ? cp.totalStudySeconds || 0 : 0;
}

function getChapterStudySeconds(courseId, chapterId) {
  const cp = getCourseProgress(courseId);
  if (!cp || !cp.chapters[chapterId]) return 0;
  return cp.chapters[chapterId].studySeconds || 0;
}

function getLatestQuizRecord(courseId) {
  const records = getDealerQuizRecords();
  const courseRecords = records[courseId];
  if (!courseRecords || courseRecords.length === 0) return null;
  return courseRecords[0];
}

function getCertificateByCourseId(courseId) {
  const certs = getDealerCertificates();
  return certs.find(function(c) { return c.courseId === courseId; }) || null;
}

function formatDateTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function formatStudyTime(seconds) {
  if (!seconds) return '0分钟';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return hours + '小时' + minutes + '分钟';
  }
  return minutes + '分钟';
}

function clearDealerTrainingData() {
  const progress = getProgress();
  const quizRecords = getQuizRecords();
  const certificates = getCertificates();
  const key = getDealerProgressKey();
  
  if (key) {
    delete progress[key];
    delete quizRecords[key];
    delete certificates[key];
    setProgress(progress);
    setQuizRecords(quizRecords);
    setCertificates(certificates);
  }
  return true;
}

module.exports = {
  COURSE_CATEGORIES: COURSE_CATEGORIES,
  CATEGORY_LABELS: CATEGORY_LABELS,
  CATEGORY_ICONS: CATEGORY_ICONS,
  CATEGORY_COLORS: CATEGORY_COLORS,
  QUIZ_PASS_SCORE: QUIZ_PASS_SCORE,
  
  getAllCourses: getAllCourses,
  getCourseById: getCourseById,
  getChapterById: getChapterById,
  getRequiredCourses: getRequiredCourses,
  
  markChapterStudy: markChapterStudy,
  submitQuiz: submitQuiz,
  
  isChapterCompleted: isChapterCompleted,
  isCourseCompleted: isCourseCompleted,
  isCourseQuizPassed: isCourseQuizPassed,
  hasCourseCertificate: hasCourseCertificate,
  hasCompletedAllRequiredCourses: hasCompletedAllRequiredCourses,
  canPerformStockOut: canPerformStockOut,
  
  getDealerProgress: getDealerProgress,
  getCourseProgress: getCourseProgress,
  getCourseStudySeconds: getCourseStudySeconds,
  getChapterStudySeconds: getChapterStudySeconds,
  getLatestQuizRecord: getLatestQuizRecord,
  getDealerCertificates: getDealerCertificates,
  getCertificateByCourseId: getCertificateByCourseId,
  getTrainingStats: getTrainingStats,
  getCompletedRequiredCourseCount: getCompletedRequiredCourseCount,
  
  formatStudyTime: formatStudyTime,
  formatDateTime: formatDateTime,
  
  clearDealerTrainingData: clearDealerTrainingData
};
