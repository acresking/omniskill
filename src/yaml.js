/**
 * OmniSkill - Zero-dependency YAML / Frontmatter Parser & Stringifier
 */

export function parseYaml(text) {
  if (!text || typeof text !== 'string') return {};

  const lines = text.split(/\r?\n/);
  const root = {};
  const stack = [{ indent: -1, container: root }];

  function parseValue(val) {
    if (val === undefined || val === null) return '';
    val = val.trim();
    if (val === '') return '';
    if (val === 'true' || val === 'True') return true;
    if (val === 'false' || val === 'False') return false;
    if (val === 'null' || val === '~' || val === 'Null') return null;
    if (/^-?\d+$/.test(val)) return parseInt(val, 10);
    if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);

    // Quoted strings
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      return val.slice(1, -1);
    }
    // Inline array [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim();
      if (!inner) return [];
      return inner.split(',').map(s => parseValue(s.trim()));
    }
    return val;
  }

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    // Ignore pure comment or blank lines
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) {
      i++;
      continue;
    }

    const indent = rawLine.search(/\S/);
    const line = rawLine.trim();

    // Multiline literal block (| or >)
    if (line.includes(': |') || line.includes(': >')) {
      const colonIdx = line.indexOf(':');
      const key = line.slice(0, colonIdx).trim();
      const multilineLines = [];
      const baseIndent = indent;
      i++;
      while (i < lines.length) {
        const nextRaw = lines[i];
        if (!nextRaw.trim()) {
          multilineLines.push('');
          i++;
          continue;
        }
        const nextIndent = nextRaw.search(/\S/);
        if (nextIndent <= baseIndent) {
          break;
        }
        multilineLines.push(nextRaw.slice(baseIndent + 2));
        i++;
      }
      
      // pop stack to current indent
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
      const parent = stack[stack.length - 1].container;
      parent[key] = multilineLines.join('\n').trim();
      continue;
    }

    // List item: "- value" or "- key: val"
    if (line.startsWith('- ')) {
      const content = line.slice(2).trim();
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
      const parent = stack[stack.length - 1].container;

      if (!Array.isArray(parent)) {
        // If parent has a last key that should be an array, or parent itself is not array
        // We find the active array
      }

      if (content.includes(':')) {
        const colonIdx = content.indexOf(':');
        const k = content.slice(0, colonIdx).trim();
        const v = content.slice(colonIdx + 1).trim();
        const itemObj = {};
        if (v) {
          itemObj[k] = parseValue(v);
        } else {
          itemObj[k] = {};
        }

        if (Array.isArray(parent)) {
          parent.push(itemObj);
          stack.push({ indent, container: itemObj });
        }
      } else {
        if (Array.isArray(parent)) {
          parent.push(parseValue(content));
        }
      }
      i++;
      continue;
    }

    // Key-value pair: "key: value" or "key:"
    if (line.includes(':')) {
      const colonIdx = line.indexOf(':');
      const key = line.slice(0, colonIdx).trim();
      const valStr = line.slice(colonIdx + 1).trim();

      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
      const parent = stack[stack.length - 1].container;

      if (valStr === '') {
        // Lookahead to see if next line is a list or an object
        let nextIsList = false;
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim() && !lines[j].trim().startsWith('#')) {
            if (lines[j].trim().startsWith('- ')) {
              nextIsList = true;
            }
            break;
          }
        }
        const newContainer = nextIsList ? [] : {};
        if (Array.isArray(parent)) {
          const tempObj = {};
          tempObj[key] = newContainer;
          parent.push(tempObj);
          stack.push({ indent, container: newContainer });
        } else {
          parent[key] = newContainer;
          stack.push({ indent, container: newContainer });
        }
      } else {
        if (Array.isArray(parent)) {
          const tempObj = {};
          tempObj[key] = parseValue(valStr);
          parent.push(tempObj);
        } else {
          parent[key] = parseValue(valStr);
        }
      }
      i++;
      continue;
    }

    i++;
  }

  return root;
}

export function stringifyYaml(data, indentLevel = 0) {
  const indent = '  '.repeat(indentLevel);
  if (data === null || data === undefined) return '';
  if (typeof data === 'boolean' || typeof data === 'number') return String(data);
  if (typeof data === 'string') {
    if (data.includes('\n')) {
      const indented = data.split('\n').map(l => `${indent}  ${l}`).join('\n');
      return `|\n${indented}`;
    }
    if (/[:#\[\]\{\},'"`]/.test(data) || data.trim() !== data) {
      return JSON.stringify(data);
    }
    return data;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return '[]';
    return data
      .map(item => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const entries = Object.entries(item);
          if (entries.length === 0) return `${indent}- {}`;
          const [firstKey, firstVal] = entries[0];
          let firstLine = `${indent}- ${firstKey}:`;
          if (typeof firstVal === 'object' && firstVal !== null) {
            firstLine += `\n${stringifyYaml(firstVal, indentLevel + 2)}`;
          } else {
            firstLine += ` ${stringifyYaml(firstVal, 0)}`;
          }
          const restLines = entries.slice(1).map(([k, v]) => {
            if (typeof v === 'object' && v !== null) {
              return `${indent}  ${k}:\n${stringifyYaml(v, indentLevel + 2)}`;
            }
            return `${indent}  ${k}: ${stringifyYaml(v, 0)}`;
          });
          return [firstLine, ...restLines].join('\n');
        }
        return `${indent}- ${stringifyYaml(item, indentLevel + 1)}`;
      })
      .join('\n');
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return '{}';
    return keys
      .map(key => {
        const val = data[key];
        if (val === undefined) return '';
        if (typeof val === 'object' && val !== null) {
          if (Array.isArray(val) && val.length === 0) return `${indent}${key}: []`;
          if (!Array.isArray(val) && Object.keys(val).length === 0) return `${indent}${key}: {}`;
          return `${indent}${key}:\n${stringifyYaml(val, indentLevel + 1)}`;
        }
        return `${indent}${key}: ${stringifyYaml(val, 0)}`;
      })
      .filter(Boolean)
      .join('\n');
  }

  return String(data);
}

export function extractFrontmatter(content) {
  if (!content || typeof content !== 'string') {
    return { attributes: {}, body: '' };
  }

  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { attributes: {}, body: content.trim() };
  }

  const yamlStr = match[1];
  const body = (match[2] || '').trim();
  const attributes = parseYaml(yamlStr);
  return { attributes, body };
}

export function injectFrontmatter(attributes, body = '') {
  if (!attributes || Object.keys(attributes).length === 0) {
    return body.trim();
  }
  const yamlStr = stringifyYaml(attributes);
  return `---\n${yamlStr}\n---\n\n${body.trim()}\n`;
}
