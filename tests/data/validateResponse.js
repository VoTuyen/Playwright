// validateResponse.js
import Ajv from 'ajv';
import { responseSchema } from '../data/package_screen_schema';

const ajv = new Ajv({ allErrors: true, strict: false });

export function validateResponse(data) {
  if (!responseSchema || typeof responseSchema !== 'object') {
    throw new Error('Invalid responseSchema: must be a non-null object');
  }

  const validate = ajv.compile(responseSchema);
  const valid = validate(data);
  if (valid) return { ok: true, data };

  const errors = (validate.errors || []).map((e) => {
    const path = e.instancePath || "";
    const field = path.replace(/^\//, "").replace(/\//g, ".");
    return { field: field || "(unknown)", message: e.message };
  });
  return { ok: false, errors };
}