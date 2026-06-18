/**
 * reviewTrust 模块单元测试
 * 测试功能：
 * 1. TRUST_LEVELS - 信任级别定义
 * 2. determineTrustLevel - 信任级别判定
 * 3. isScanVerified - 扫码验证状态
 * 4. validateReviewSubmission - 反刷机制验证
 * 5. calculateWeightedRating - 加权平均评分
 * 6. sortReviewsByTrust - 信任加权排序
 * 7. convertNoteToReviewPreview - 笔记转评价预览
 */

// 模拟微信小程序环境
const storage = {};
global.wx = {
  setStorageSync: jest.fn((key, value) => {
    storage[key] = value;
  }),
  getStorageSync: jest.fn((key) => {
    return storage[key] || [];
  }),
  clearStorageSync: jest.fn(() => {
    Object.keys(storage).forEach(key => delete storage[key]);
  })
};

// 模拟 auth 模块
global.auth = {
  isLoggedIn: jest.fn(() => true),
  getUserInfo: jest.fn(() => ({ openId: 'test-openid-001', userId: 'U001' })),
  getOpenId: jest.fn(() => 'test-openid-001')
};

const reviewTrust = require('../utils/reviewTrust.js');

describe('reviewTrust 模块测试', () => {
  beforeEach(() => {
    wx.clearStorageSync();
  });

  describe('TRUST_LEVELS 测试', () => {
    test('信任级别应该包含三个级别', () => {
      expect(reviewTrust.TRUST_LEVELS).toHaveProperty('VERIFIED_PURCHASE');
      expect(reviewTrust.TRUST_LEVELS).toHaveProperty('REGULAR_PURCHASE');
      expect(reviewTrust.TRUST_LEVELS).toHaveProperty('ANONYMOUS');
    });

    test('信任级别权重应该正确', () => {
      expect(reviewTrust.TRUST_LEVELS.VERIFIED_PURCHASE.weight).toBe(10);
      expect(reviewTrust.TRUST_LEVELS.REGULAR_PURCHASE.weight).toBe(5);
      expect(reviewTrust.TRUST_LEVELS.ANONYMOUS.weight).toBe(1);
    });

    test('信任级别名称应该正确', () => {
      expect(reviewTrust.TRUST_LEVELS.VERIFIED_PURCHASE.name).toBe('已验真购买');
      expect(reviewTrust.TRUST_LEVELS.REGULAR_PURCHASE.name).toBe('普通购买');
      expect(reviewTrust.TRUST_LEVELS.ANONYMOUS.name).toBe('匿名评价');
    });
  });

  describe('扫码验证功能测试', () => {
    test('addScanVerifyRecord 应该记录扫码验证', () => {
      reviewTrust.addScanVerifyRecord('G001');
      expect(reviewTrust.isScanVerified('G001')).toBe(true);
    });

    test('未扫码验证的产品应该返回 false', () => {
      expect(reviewTrust.isScanVerified('G001')).toBe(false);
    });

    test('isScanVerified 应该支持不同 traceId', () => {
      reviewTrust.addScanVerifyRecord('G001');
      expect(reviewTrust.isScanVerified('G001')).toBe(true);
      expect(reviewTrust.isScanVerified('G002')).toBe(false);
    });
  });

  describe('评价发布记录测试', () => {
    test('addReviewSubmitRecord 应该记录评价发布', () => {
      reviewTrust.addReviewSubmitRecord('G001', 'REV-001');
      expect(reviewTrust.hasSubmittedReview('G001')).toBe(true);
    });

    test('未评价过的产品应该返回 false', () => {
      expect(reviewTrust.hasSubmittedReview('G001')).toBe(false);
    });

    test('getReviewSubmitHistory 应该返回所有历史记录', () => {
      reviewTrust.addReviewSubmitRecord('G001', 'REV-001');
      reviewTrust.addReviewSubmitRecord('G002', 'REV-002');
      const history = reviewTrust.getReviewSubmitHistory();
      expect(history).toHaveLength(2);
    });
  });

  describe('determineTrustLevel 测试', () => {
    test('已登录 + 已扫码验证应该返回 VERIFIED_PURCHASE', () => {
      reviewTrust.addScanVerifyRecord('G001');
      const level = reviewTrust.determineTrustLevel('G001', 'U001', false);
      expect(level.key).toBe('verified_purchase');
      expect(level.weight).toBe(10);
    });

    test('已登录 + 有订单信息应该返回 REGULAR_PURCHASE', () => {
      const level = reviewTrust.determineTrustLevel('G001', 'U001', true);
      expect(level.key).toBe('regular_purchase');
      expect(level.weight).toBe(5);
    });

    test('未登录应该返回 ANONYMOUS', () => {
      const level = reviewTrust.determineTrustLevel('G001', null, false);
      expect(level.key).toBe('anonymous');
      expect(level.weight).toBe(1);
    });

    test('已登录但未验证且无订单应该返回 REGULAR_PURCHASE', () => {
      const level = reviewTrust.determineTrustLevel('G001', 'U001', false);
      expect(level.key).toBe('regular_purchase');
      expect(level.weight).toBe(5);
    });
  });

  describe('validateReviewSubmission 测试', () => {
    test('评价内容过短应该验证失败', () => {
      const result = reviewTrust.validateReviewSubmission('G001', '短', 5);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('包含敏感词应该触发审核但验证通过', () => {
      const result = reviewTrust.validateReviewSubmission('G001', '这是一个广告内容，联系方式123456', 5);
      expect(result.valid).toBe(true);
      expect(result.needAudit).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('同一用户对同一产品重复评价应该验证失败', () => {
      reviewTrust.addReviewSubmitRecord('G001', 'REV-001');
      const result = reviewTrust.validateReviewSubmission('G001', '这是一条评价内容', 5);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('已对该产品发表过评价');
    });

    test('短时间大量评价应该触发审核', () => {
      reviewTrust.addReviewSubmitRecord('G001', 'REV-001');
      reviewTrust.addReviewSubmitRecord('G002', 'REV-002');
      reviewTrust.addReviewSubmitRecord('G003', 'REV-003');
      const result = reviewTrust.validateReviewSubmission('G004', '这是第四条评价内容', 5);
      expect(result.valid).toBe(true);
      expect(result.needAudit).toBe(true);
    });

    test('正常评价应该验证通过', () => {
      const result = reviewTrust.validateReviewSubmission('G001', '这是一条正常的评价内容，超过五个字', 5);
      expect(result.valid).toBe(true);
      expect(result.needAudit).toBe(false);
      expect(result.errors.length).toBe(0);
    });
  });

  describe('calculateWeightedRating 测试', () => {
    test('应该正确计算加权平均评分', () => {
      const reviews = [
        { trustLevel: { weight: 10 }, rating: 5 },
        { trustLevel: { weight: 5 }, rating: 4 },
        { trustLevel: { weight: 1 }, rating: 3 }
      ];
      const weightedRating = reviewTrust.calculateWeightedRating(reviews);
      expect(weightedRating).toBeCloseTo(4.56, 1);
    });

    test('空评价列表应该返回 0', () => {
      const weightedRating = reviewTrust.calculateWeightedRating([]);
      expect(weightedRating).toBe(0);
    });

    test('单个评价应该等于其评分', () => {
      const reviews = [
        { trustLevel: { weight: 10 }, rating: 5 }
      ];
      const weightedRating = reviewTrust.calculateWeightedRating(reviews);
      expect(weightedRating).toBe(5);
    });
  });

  describe('sortReviewsByTrust 测试', () => {
    const createTestReviews = () => [
      { id: '1', trustLevel: { weight: 1 }, rating: 5, likeCount: 10, createTime: '2025-01-01', isPinned: false, isQuality: false, qualityScore: 50 },
      { id: '2', trustLevel: { weight: 10 }, rating: 4, likeCount: 5, createTime: '2025-01-03', isPinned: false, isQuality: false, qualityScore: 90 },
      { id: '3', trustLevel: { weight: 5 }, rating: 3, likeCount: 20, createTime: '2025-01-02', isPinned: true, isQuality: false, qualityScore: 70 }
    ];

    test('quality 排序应该按质量分降序', () => {
      const reviews = createTestReviews();
      const sorted = reviewTrust.sortReviewsByTrust(reviews, 'quality');
      expect(sorted[0].id).toBe('3');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('1');
    });

    test('trust 排序应该按信任权重降序', () => {
      const reviews = createTestReviews();
      const sorted = reviewTrust.sortReviewsByTrust(reviews, 'trust');
      expect(sorted[0].trustLevel.weight).toBe(10);
      expect(sorted[1].trustLevel.weight).toBe(5);
      expect(sorted[2].trustLevel.weight).toBe(1);
    });

    test('newest 排序应该按时间降序', () => {
      const reviews = createTestReviews();
      const sorted = reviewTrust.sortReviewsByTrust(reviews, 'newest');
      expect(sorted[0].createTime).toBe('2025-01-03');
      expect(sorted[1].createTime).toBe('2025-01-02');
      expect(sorted[2].createTime).toBe('2025-01-01');
    });

    test('highest 排序应该按评分降序', () => {
      const reviews = createTestReviews();
      const sorted = reviewTrust.sortReviewsByTrust(reviews, 'highest');
      expect(sorted[0].rating).toBe(5);
      expect(sorted[1].rating).toBe(4);
      expect(sorted[2].rating).toBe(3);
    });
  });

  describe('convertNoteToReviewPreview 测试', () => {
    test('应该正确将笔记转换为评价预览', () => {
      reviewTrust.addScanVerifyRecord('G001');
      const note = {
        id: 'NOTE-001',
        content: '这是一条品鉴笔记，描述了茶的香气和口感',
        rating: 5,
        tags: ['花香', '回甘', '醇厚']
      };
      const preview = reviewTrust.convertNoteToReviewPreview(note, 'G001');
      expect(preview).toHaveProperty('rating', 5);
      expect(preview).toHaveProperty('content');
      expect(preview.tasteTags).toContain('花香');
      expect(preview.tasteTags).toContain('回甘');
      expect(preview.trustLevel.key).toBe('verified_purchase');
    });

    test('未扫码验证的笔记应该对应普通购买级别', () => {
      const note = {
        id: 'NOTE-001',
        content: '这是一条品鉴笔记',
        rating: 4,
        tags: ['清甜']
      };
      const preview = reviewTrust.convertNoteToReviewPreview(note, 'G002');
      expect(preview.trustLevel.key).toBe('regular_purchase');
    });

    test('应该正确映射维度评分', () => {
      const note = {
        id: 'NOTE-001',
        content: '这是一条品鉴笔记',
        rating: 5,
        tags: ['花香', '回甘', '醇厚', '清甜', '余韵']
      };
      const preview = reviewTrust.convertNoteToReviewPreview(note, 'G001');
      expect(preview.dimensions.aroma).toBeGreaterThanOrEqual(4);
      expect(preview.dimensions.taste).toBeGreaterThanOrEqual(4);
      expect(preview.dimensions.value).toBeGreaterThanOrEqual(4);
    });
  });

  describe('prepareReviewForDisplay 测试', () => {
    test('应该正确计算质量分', () => {
      const review = {
        trustLevel: { weight: 10 },
        content: '这是一条详细的评价内容，超过了一定的长度',
        images: ['img1.jpg', 'img2.jpg'],
        tasteTags: ['花香', '回甘'],
        likeCount: 50
      };
      const prepared = reviewTrust.prepareReviewForDisplay(review);
      expect(prepared).toHaveProperty('qualityScore');
      expect(prepared.qualityScore).toBeGreaterThan(80);
      expect(prepared.qualityScore).toBeLessThanOrEqual(100);
    });

    test('内容为空应该质量分较低', () => {
      const review = {
        trustLevel: { weight: 1 },
        content: '好',
        images: [],
        tasteTags: [],
        likeCount: 0
      };
      const prepared = reviewTrust.prepareReviewForDisplay(review);
      expect(prepared.qualityScore).toBeLessThan(40);
    });
  });
});
