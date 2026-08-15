import { describe, expect, it } from 'vitest';
import { extractJsonPath } from './jsonpath-extractor.service';

describe('jsonpath-extractor service', () => {
  it('extracts a property from every item in an array', () => {
    const result = extractJsonPath('{"data":[{"a":"1"},{"a":"2"}]}', '$.data[*].a');

    expect(result).toEqual({
      ok: true,
      matches: ['1', '2'],
      output: '[\n  "1",\n  "2"\n]',
    });
  });

  it('filters items before extracting a property', () => {
    const json = JSON.stringify({
      orders: [
        { id: 'A-1001', status: 'paid', total: 268 },
        { id: 'A-1002', status: 'pending', total: 88 },
        { id: 'A-1003', status: 'paid', total: 520 },
      ],
    });

    const result = extractJsonPath(json, '$.orders[?(@.status == "paid" && @.total >= 300)].id');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.matches).toEqual(['A-1003']);
    }
  });

  it('recursively extracts nested properties', () => {
    const json = JSON.stringify({
      departments: [
        { members: [{ email: 'alice@example.com' }, { contact: { email: 'bob@example.com' } }] },
      ],
      support: { email: 'support@example.com' },
    });

    const result = extractJsonPath(json, '$..email');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.matches).toEqual(['alice@example.com', 'bob@example.com', 'support@example.com']);
    }
  });

  it('returns an empty array when the path has no matches', () => {
    expect(extractJsonPath('{"data":[]}', '$.data[*].a')).toEqual({
      ok: true,
      matches: [],
      output: '[]',
    });
  });

  it('reports invalid JSON separately from JSONPath errors', () => {
    expect(extractJsonPath('{"data":', '$.data')).toEqual({ ok: false, code: 'INVALID_JSON' });
  });

  it('rejects an invalid JSONPath expression', () => {
    expect(extractJsonPath('{"data":[{"a":1}]}', '$.data[?(@.a ==)]')).toEqual({ ok: false, code: 'INVALID_PATH' });
  });
});
