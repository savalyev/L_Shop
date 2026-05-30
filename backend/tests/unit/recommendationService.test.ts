import { RecommendationService } from '../../src/services/products/recommendationService';
import * as fs from 'fs';

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('RecommendationService', () => {
const mockTags = [
{ productId: 1, tags: ['fruit', 'citrus'] },
{ productId: 2, tags: ['fruit', 'sweet'] }
];
const mockUserPrefs = [
{ userId: 10, tagWeights: { fruit: 2, citrus: 1 }, lastUpdated: new Date().toISOString() }
];

beforeEach(() => {
jest.resetAllMocks();
mockedFs.existsSync.mockReturnValue(true);
mockedFs.readFileSync.mockImplementation((filePath) => {
const pathStr = filePath.toString();
if (pathStr.includes('tags.json')) {
return JSON.stringify(mockTags);
}
if (pathStr.includes('user_tags.json')) {
return JSON.stringify(mockUserPrefs);
}
return '[]';
});
mockedFs.writeFileSync.mockImplementation(() => {});
});

test('likeProduct should update user tag weights', () => {
RecommendationService.likeProduct(10, 1);
expect(mockedFs.writeFileSync).toHaveBeenCalled();
const writeCall = mockedFs.writeFileSync.mock.calls.find(call =>
call[0].toString().includes('user_tags.json')
);
// Добавляем проверку, что writeCall существует
expect(writeCall).toBeDefined();
if (writeCall) {
const savedData = JSON.parse(writeCall[1] as string);
const userPref = savedData.find((u: any) => u.userId === 10);
expect(userPref.tagWeights.fruit).toBe(3);
}
});

test('getRecommendedProducts returns product ids sorted by score', () => {
const recs = RecommendationService.getRecommendedProducts(10, 2);
expect(recs).toEqual([1, 2]);
});

test('getRecommendedProducts returns empty if no user preferences', () => {
const recs = RecommendationService.getRecommendedProducts(999, 5);
expect(recs).toEqual([]);
});

test('likeProduct does nothing if product has no tags', () => {
RecommendationService.likeProduct(10, 999);
const writeCalls = mockedFs.writeFileSync.mock.calls.filter(call =>
call[0].toString().includes('user_tags.json')
);
expect(writeCalls.length).toBe(0);
});
});