// latinum-inflate — pure-Node prose inflator for MCP tool descriptions
// Expands strings with elaborate filler, Ferengi-style flourish,
// verbose pleasantries, and explanatory commentary.
// Opposite of latinum-inflate.
//
// API: inflate(text, opts?) → { inflated, before, after }
//
// Boundaries (same as latinum-inflate — NEVER touch):
//  - fenced code blocks (``` ... ```)
//  - inline code (`...`)
//  - URLs (https?://...)
//  - filesystem paths (anything with `/` or `\`)
//  - "code-looking" tokens (parens at end, semicolons, JSON-like braces)
//  - identifiers in CamelCase / snake_case / dotted.path form
//
// Inflation adds:
//  - Ferengi-style flourish prefixes and suffixes
//  - expanded synonyms for common short verbs
//  - filler words (actually, really, quite, very, truly, indeed)
//  - pleasantries (please, kindly, delighted, honor)
//  - hedging (perhaps, I believe, it seems, one might say)
//  - extra padding for short descriptions

'use strict';

const FERENGI_PREFIXES = [
  'Presenting a truly magnificent tool that would make even the Grand Nagus weep with joy \u2014 ',
  'Allow me to humbly direct your esteemed attention to this wonderfully useful utility: ',
  'In the spirit of the Rules of Acquisition, I present to you this valuable instrument: ',
  'It is my distinct pleasure and privilege to describe this absolutely splendid tool \u2014 ',
  'Behold!  A tool of such remarkable utility that it simply must be experienced to be fully appreciated: ',
  'By the Great River of Profit, I give you this most excellent and worthy tool: ',
  'Gather \u2019round, for I have been tasked with describing a tool of unparalleled magnificence: ',
  'If I may have a moment of your valuable time, I would like to present this truly exceptional tool: ',
];

const FERENGI_SUFFIXES = [
  ' Truly, this is a tool that any wise being would add to their collection without hesitation.',
  ' And remember, as the Rules of Acquisition teach us \u2014 a tool that is used is a tool that earns its keep.',
  ' May this tool serve you as faithfully as it has served countless others before you, and may your profits grow accordingly.',
  ' Such a tool!  Such utility!  Such magnificence!  It is, without question, among the finest examples of its kind.',
  ' One might say this is the finest example of its kind in the entire quadrant \u2014 and one would be correct.',
  ' I assure you, this tool will prove to be a most profitable addition to your repertoire.',
  ' A tool of this caliber does not cross one\u2019s path every day \u2014 treasure it accordingly.',
  ' And that, my friend, is the essence of true value \u2014 utility combined with elegance.',
];

const WORD_EXPANSIONS = {
  use: 'utilize',
  uses: 'utilizes',
  used: 'utilized',
  using: 'utilizing',
  get: 'obtain',
  gets: 'obtains',
  set: 'configure',
  sets: 'configures',
  setting: 'configuring',
  make: 'fabricate',
  makes: 'fabricates',
  making: 'fabricating',
  show: 'display',
  shows: 'displays',
  list: 'enumerate',
  lists: 'enumerates',
  find: 'locate',
  finds: 'locates',
  help: 'provide assistance',
  helps: 'provides assistance',
  run: 'execute',
  runs: 'executes',
  running: 'executing',
  add: 'include',
  adds: 'includes',
  remove: 'eliminate',
  removes: 'eliminates',
  delete: 'eradicate',
  deletes: 'eradicates',
  save: 'preserve',
  saves: 'preserves',
  loading: 'retrieving',
  loaded: 'retrieved',
  good: 'splendid',
  bad: 'suboptimal',
  big: 'substantial',
  small: 'compact',
  new: 'brand-new',
  old: 'well-established',
  easy: 'straightforward',
  hard: 'challenging',
  fast: 'rapid',
};

const FILLER_PHRASES = [
  ' actually ',
  ' really ',
  ' quite ',
  ' very ',
  ' truly ',
  ' simply ',
  ' indeed ',
  ' certainly ',
  ' in fact ',
  ' without a doubt ',
  ' unquestionably ',
  ' most assuredly ',
  ' as it were ',
  ' so to speak ',
];

const HEDGE_PHRASES = [
  'perhaps ',
  'I believe ',
  'it seems that ',
  'one might say that ',
  'I would venture that ',
  'it could be argued that ',
  'in my humble opinion ',
  'as the wise Ferengi say ',
  'if I may be so bold as to suggest ',
];

const SHORT_PADDING = [
  ' \u2014 this is an absolutely essential parameter that must be provided with care and attention to detail.',
  ', which is a critically important piece of information that the tool requires to function properly.',
  ' \u2014 please ensure that this value is provided correctly, as the tool depends on it for accurate operation.',
  '; providing this will allow the tool to perform its function with maximum effectiveness and efficiency.',
];

const PROTECTED_PATTERNS = [
  /```[\s\S]*?```/g,
  /`[^`\n]+`/g,
  /\bhttps?:\/\/\S+/gi,
  /\b[\w.-]*[\/\\][\w.\/\\\-]+/g,
  /\b[A-Z][A-Za-z0-9]*(?:_[A-Z][A-Za-z0-9]*)+\b/g,
  /\b\d+\.\d+\.\d+\b/g,
  /\b\w+\.\w+(?:\.\w+)*\(\)?/g,
  /[A-Za-z_][A-Za-z0-9_]*\s*\([^)]*\)/g,
];

function withProtectedSegments(text, transform) {
  const segments = [];
  let working = text;
  for (const re of PROTECTED_PATTERNS) {
    working = working.replace(re, m => {
      const i = segments.length;
      segments.push(m);
      return '\x00' + i + '\x00';
    });
  }
  let out = transform(working);
  out = out.replace(/\x00(\d+)\x00/g, (_, i) => segments[+i]);
  return out;
}

function simpleHash(s) {
  return s.split('').reduce(function (h, c) {
    return ((h << 5) - h) + c.charCodeAt(0) | 0;
  }, 0);
}

function inflateProse(text) {
  var s = text.trim();
  if (!s) return s;

  // Expand common short verbs and adjectives to verbose forms
  for (var _short in WORD_EXPANSIONS) {
    var re = new RegExp('\\b' + _short + '\\b', 'gi');
    s = s.replace(re, WORD_EXPANSIONS[_short]);
  }

  // Deterministic hash for picking variants (same input = same output)
  var h = simpleHash(s);

  // Insert hedges and pleasantries at sentence boundaries for multi-sentence text
  var sentences = s.split(/(?<=\.)\s+/);
  if (sentences.length > 1) {
    s = sentences.map(function (sent, i) {
      if (i < sentences.length - 1) {
        var hedge = HEDGE_PHRASES[Math.abs(h + i * 3) % HEDGE_PHRASES.length];
        return sent + ', and ' + hedge;
      }
      return sent;
    }).join('');
  }

  // Short descriptions (typical of parameter descriptions) get extra explanatory padding
  if (s.length < 40) {
    var pad = SHORT_PADDING[Math.abs(h + 7) % SHORT_PADDING.length];
    s += pad;
  }

  // Sprinkle fillers after the first sentence
  var firstDot = s.indexOf('.');
  if (firstDot !== -1 && s.length > 60) {
    var filler = FILLER_PHRASES[Math.abs(h + 13) % FILLER_PHRASES.length];
    s = s.slice(0, firstDot + 1) + filler + s.slice(firstDot + 1);
  }

  // Ferengi framing
  var prefixIdx = Math.abs(h) % FERENGI_PREFIXES.length;
  var suffixIdx = Math.abs(h * 7 + 13) % FERENGI_SUFFIXES.length;
  var prefix = FERENGI_PREFIXES[prefixIdx];
  var suffix = FERENGI_SUFFIXES[suffixIdx];

  s = prefix + s.charAt(0).toLowerCase() + s.slice(1) + suffix;

  return s;
}

function inflate(text, _opts) {
  if (typeof text !== 'string' || text.length === 0) {
    return { inflated: text, before: 0, after: 0 };
  }
  var before = text.length;
  var inflated = withProtectedSegments(text, inflateProse);
  return { inflated: inflated, before: before, after: inflated.length };
}

// Walk a JSON-RPC payload and inflate every description field in place.
function inflateDescriptionsInPlace(obj, fieldNames) {
  var fields = new Set(fieldNames || ['description']);
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      inflateDescriptionsInPlace(obj[i], fieldNames || ['description']);
    }
    return;
  }
  var keys = Object.keys(obj);
  for (var ki = 0; ki < keys.length; ki++) {
    var key = keys[ki];
    var val = obj[key];
    if (fields.has(key) && typeof val === 'string') {
      obj[key] = inflate(val).inflated;
    } else if (val && typeof val === 'object') {
      inflateDescriptionsInPlace(val, fieldNames || ['description']);
    }
  }
}

module.exports = { inflate: inflate, inflateDescriptionsInPlace: inflateDescriptionsInPlace, withProtectedSegments: withProtectedSegments };
