import { JSONPath } from 'jsonpath-plus';

export type JsonPathExtractionErrorCode = 'EMPTY_JSON' | 'INVALID_JSON' | 'EMPTY_PATH' | 'INVALID_PATH';

export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export type JsonPathExtractionResult =
  | {
    ok: true
    matches: JsonValue[]
    output: string
  }
  | {
    ok: false
    code: JsonPathExtractionErrorCode
  };

/**
 * 在浏览器本地解析 JSON 并执行 JSONPath 查询，不持久化任何输入内容。
 */
export function extractJsonPath(jsonText: string, path: string): JsonPathExtractionResult {
  if (jsonText.trim() === '') {
    return { ok: false, code: 'EMPTY_JSON' };
  }

  let json: JsonValue;
  try {
    json = JSON.parse(jsonText) as JsonValue;
  }
  catch {
    return { ok: false, code: 'INVALID_JSON' };
  }

  const normalizedPath = path.trim();
  if (normalizedPath === '') {
    return { ok: false, code: 'EMPTY_PATH' };
  }

  if (!normalizedPath.startsWith('$')) {
    return { ok: false, code: 'INVALID_PATH' };
  }

  try {
    const matches = JSONPath<JsonValue[]>({
      path: normalizedPath,
      json,
      eval: 'safe',
      resultType: 'value',
      wrap: true,
    });

    return {
      ok: true,
      matches,
      output: JSON.stringify(matches, null, 2),
    };
  }
  catch {
    return { ok: false, code: 'INVALID_PATH' };
  }
}
