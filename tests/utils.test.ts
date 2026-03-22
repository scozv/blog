import { describe, it, expect, vi } from 'vitest';
import postFilter from '../src/utils/postFilter';
import getSortedPosts from '../src/utils/getSortedPosts';
import type { CollectionEntry } from 'astro:content';

vi.mock('../src/config', () => ({
  SITE: {
    scheduledPostMargin: 1000 * 60 * 15, // 15 mins
    descBy: 'pubDatetime'
  }
}));

// Helper to create mock posts
const createPost = (id: string, overrides: Partial<CollectionEntry<'blog'>['data']> = {}): CollectionEntry<'blog'> => ({
  id,
  slug: id,
  body: '',
  collection: 'blog',
  data: {
    title: id,
    description: '',
    pubDatetime: new Date(),
    modDatetime: null,
    author: '',
    featured: false,
    draft: false,
    tags: [],
    ...overrides
  } as any
} as any);

describe('postFilter', () => {
  it('should filter out drafts', () => {
    const post = createPost('test', { draft: true });
    expect(postFilter(post)).toBe(false);
  });

  it('should NOT filter out future posts in DEV mode (which Vitest uses by default)', () => {
    const post = createPost('test', { pubDatetime: new Date(Date.now() + 1000 * 60 * 60) });
    expect(postFilter(post)).toBe(true);
  });

  it('should deduplicate chinese version if english exists when allPosts is provided', () => {
    const enPost = createPost('my-post');
    const zhPost = createPost('my-post-zh');
    const allPosts = [enPost, zhPost];

    // English post should remain
    expect(postFilter(enPost, 0, allPosts)).toBe(true);
    // Chinese post should be filtered out
    expect(postFilter(zhPost, 1, allPosts)).toBe(false);
  });

  it('should keep chinese version if no english version exists', () => {
    const zhPost = createPost('only-zh-post-zh');
    const allPosts = [zhPost];
    expect(postFilter(zhPost, 0, allPosts)).toBe(true);
  });

  it('should not deduplicate if allPosts is undefined (e.g. RSS)', () => {
    const zhPost = createPost('my-post-zh');
    expect(postFilter(zhPost)).toBe(true);
  });
});

describe('getSortedPosts', () => {
  it('should sort by pubDatetime by default', () => {
    const older = createPost('older', { pubDatetime: new Date('2023-01-01') });
    const newer = createPost('newer', { pubDatetime: new Date('2024-01-01') });
    
    const sorted = getSortedPosts([older, newer]);
    expect(sorted[0].id).toBe('newer');
    expect(sorted[1].id).toBe('older');
  });

  it('should sort by modDatetime when requested', () => {
    const original = createPost('original', { 
      pubDatetime: new Date('2023-01-01'),
      modDatetime: new Date('2024-06-01') // recently updated
    });
    const newer = createPost('newer', { 
      pubDatetime: new Date('2024-01-01') 
    });

    const sorted = getSortedPosts([original, newer], 'modDatetime');
    // original should be first because it was modified later
    expect(sorted[0].id).toBe('original');
    expect(sorted[1].id).toBe('newer');
  });

  it('should fallback to pubDatetime if modDatetime is missing when sorting by modDatetime', () => {
    const postA = createPost('A', { 
      pubDatetime: new Date('2023-01-01'),
      modDatetime: new Date('2024-06-01')
    });
    const postB = createPost('B', { 
      pubDatetime: new Date('2024-08-01') 
      // no modDatetime
    });

    const sorted = getSortedPosts([postA, postB], 'modDatetime');
    // postB's pubDatetime is > postA's modDatetime
    expect(sorted[0].id).toBe('B');
    expect(sorted[1].id).toBe('A');
  });
});
