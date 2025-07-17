// syntaxHandler/syntaxLanguages.ts

import { Language } from '@/lib/languages';

export interface SyntaxToken {
  type:
    | 'keyword'
    | 'string'
    | 'comment'
    | 'number'
    | 'operator'
    | 'function'
    | 'variable'
    | 'type'
    | 'constant'
    | 'property'
    | 'tag'
    | 'attribute'
    | 'value'
    | 'punctuation'
    | 'builtin'
    | 'class'
    | 'namespace'
    | 'regex'
    | 'escape'
    | 'docstring'
    | 'decorator'
    | 'parameter'
    | 'method'
    | 'field'
    | 'enum'
    | 'interface'
    | 'module'
    | 'macro'
    | 'label'
    | 'annotation'
    | 'generic'
    | 'template'
    | 'selector'
    | 'length'   
    | 'color'    
    | 'identifier' 
    | 'config-section'
    | 'config-key'
    | 'config-value'
    | 'yaml-key'
    | 'yaml-value'
    | 'json-key'
    | 'json-value'
    | 'sql-keyword'
    | 'sql-function'
    | 'sql-type'
    | 'graphql-keyword'
    | 'graphql-type'
    | 'shell-command'
    | 'shell-flag'
    | 'shell-variable'
    | 'dockerfile-instruction'
    | 'dockerfile-flag'
    | 'important'
    | 'entity'
    | 'heading'
    | 'bold'
    | 'italic'
    | 'link'
    | 'code'
    | 'quote'
    | 'list'
    | 'table';
  value: string;
  startIndex: number;
  endIndex: number;
}

export interface SyntaxRule {
  pattern: RegExp;
  type: SyntaxToken['type'];
  priority: number;
}

export interface LanguageSyntax {
  languageId: string;
  rules: SyntaxRule[];
  multiLinePatterns?: {
    start: RegExp;
    end: RegExp;
    type: SyntaxToken['type'];
    priority: number;
  }[];
}

// Common patterns used across languages
const commonPatterns = {
  singleLineComment: /\/\/.*$/gm,
  multiLineComment: /\/\*[\s\S]*?\*\//g,
  doubleQuoteString: /"(?:[^"\\]|\\.)*"/g,
  singleQuoteString: /'(?:[^'\\]|\\.)*'/g,
  templateString: /`(?:[^`\\]|\\.)*`/g,
  number: /\b\d+\.?\d*\b/g,
  hexNumber: /\b0[xX][0-9a-fA-F]+\b/g,
  binaryNumber: /\b0[bB][01]+\b/g,
  octalNumber: /\b0[oO][0-7]+\b/g,
  floatNumber: /\b\d+\.\d+([eE][+-]?\d+)?[fF]?\b/g,
  scientificNumber: /\b\d+\.?\d*[eE][+-]?\d+\b/g,
  identifier: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g,
  function: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g,
  property: /\.\b[a-zA-Z_][a-zA-Z0-9_]*\b/g,
  constant: /\b[A-Z_][A-Z0-9_]*\b/g,
  operator: /[+\-*/%=<>!&|^~?:]/g,
  punctuation: /[{}[\]();,.]/g,
  whitespace: /\s+/g,
};

// Language-specific syntax definitions
export const languageSyntaxRules: LanguageSyntax[] = [
  // JavaScript
  {
    languageId: 'javascript',
    rules: [
      { pattern: commonPatterns.singleLineComment, type: 'comment', priority: 10 },
      { pattern: commonPatterns.multiLineComment, type: 'comment', priority: 10 },
      { pattern: commonPatterns.templateString, type: 'string', priority: 9 },
      { pattern: commonPatterns.doubleQuoteString, type: 'string', priority: 9 },
      { pattern: commonPatterns.singleQuoteString, type: 'string', priority: 9 },
      { pattern: /\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|if|import|in|instanceof|let|new|null|of|return|super|switch|this|throw|true|try|typeof|undefined|var|void|while|with|yield)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(Array|Boolean|Date|Error|Function|JSON|Math|Number|Object|Promise|RegExp|String|Symbol|Map|Set|WeakMap|WeakSet|Proxy|Reflect|ArrayBuffer|DataView|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|BigInt64Array|BigUint64Array)\b/g, type: 'builtin', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'class', priority: 5 },
      { pattern: commonPatterns.constant, type: 'constant', priority: 5 },
      { pattern: commonPatterns.number, type: 'number', priority: 4 },
      { pattern: /\/(?:[^\/\\]|\\.)+\/[gimuy]*/g, type: 'regex', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // TypeScript
  {
    languageId: 'typescript',
    rules: [
      { pattern: commonPatterns.singleLineComment, type: 'comment', priority: 10 },
      { pattern: commonPatterns.multiLineComment, type: 'comment', priority: 10 },
      { pattern: commonPatterns.templateString, type: 'string', priority: 9 },
      { pattern: commonPatterns.doubleQuoteString, type: 'string', priority: 9 },
      { pattern: commonPatterns.singleQuoteString, type: 'string', priority: 9 },
      { pattern: /\b(abstract|any|as|async|await|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|never|new|null|number|object|of|private|protected|public|readonly|return|set|static|string|super|switch|symbol|this|throw|true|try|type|typeof|undefined|union|unknown|var|void|while|with|yield)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(Array|Boolean|Date|Error|Function|JSON|Math|Number|Object|Promise|RegExp|String|Symbol|Map|Set|WeakMap|WeakSet|Proxy|Reflect|ArrayBuffer|DataView|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|BigInt64Array|BigUint64Array)\b/g, type: 'builtin', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'class', priority: 5 },
      { pattern: commonPatterns.constant, type: 'constant', priority: 5 },
      { pattern: /\b(string|number|boolean|any|void|never|unknown|object)\b/g, type: 'type', priority: 5 },
      { pattern: commonPatterns.number, type: 'number', priority: 4 },
      { pattern: /\/(?:[^\/\\]|\\.)+\/[gimuy]*/g, type: 'regex', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // Python
  {
    languageId: 'python',
    rules: [
      { pattern: /#.*$/gm, type: 'comment', priority: 10 },
      { pattern: /"""[\s\S]*?"""/g, type: 'docstring', priority: 9 },
      { pattern: /'''[\s\S]*?'''/g, type: 'docstring', priority: 9 },
      { pattern: /r?"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
      { pattern: /r?'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
      { pattern: /f"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
      { pattern: /f'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
      { pattern: /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(True|False|None)\b/g, type: 'constant', priority: 8 },
      { pattern: /\b(abs|all|any|ascii|bin|bool|bytearray|bytes|callable|chr|classmethod|compile|complex|delattr|dict|dir|divmod|enumerate|eval|exec|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|isinstance|issubclass|iter|len|list|locals|map|max|memoryview|min|next|object|oct|open|ord|pow|print|property|range|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|vars|zip)\b/g, type: 'builtin', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'class', priority: 5 },
      { pattern: /\b[A-Z_][A-Z0-9_]*\b/g, type: 'constant', priority: 5 },
      { pattern: /@[a-zA-Z_][a-zA-Z0-9_]*/g, type: 'decorator', priority: 5 },
      { pattern: /\b\d+\.?\d*\b/g, type: 'number', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // Java
  {
    languageId: 'java',
    rules: [
      { pattern: commonPatterns.singleLineComment, type: 'comment', priority: 10 },
      { pattern: commonPatterns.multiLineComment, type: 'comment', priority: 10 },
      { pattern: /\/\*\*[\s\S]*?\*\//g, type: 'docstring', priority: 9 },
      { pattern: commonPatterns.doubleQuoteString, type: 'string', priority: 9 },
      { pattern: commonPatterns.singleQuoteString, type: 'string', priority: 9 },
      { pattern: /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(true|false|null)\b/g, type: 'constant', priority: 8 },
      { pattern: /\b(String|Integer|Double|Float|Long|Boolean|Character|Byte|Short|Object|Class|System|Math|Arrays|Collections|List|ArrayList|HashMap|HashSet|TreeMap|TreeSet|LinkedList|Stack|Queue|PriorityQueue|Vector|Hashtable|Properties|StringBuilder|StringBuffer|Thread|Runnable|Exception|Error|RuntimeException|IOException|FileNotFoundException|NullPointerException|ArrayIndexOutOfBoundsException|ClassNotFoundException|NoSuchMethodException|IllegalArgumentException|IllegalStateException|UnsupportedOperationException|ConcurrentModificationException|OutOfMemoryError|StackOverflowError)\b/g, type: 'builtin', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'class', priority: 5 },
      { pattern: /\b[A-Z_][A-Z0-9_]*\b/g, type: 'constant', priority: 5 },
      { pattern: /@[a-zA-Z_][a-zA-Z0-9_]*/g, type: 'annotation', priority: 5 },
      { pattern: commonPatterns.number, type: 'number', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // C++
  {
    languageId: 'cpp',
    rules: [
      { pattern: commonPatterns.singleLineComment, type: 'comment', priority: 10 },
      { pattern: commonPatterns.multiLineComment, type: 'comment', priority: 10 },
      { pattern: /#.*$/gm, type: 'macro', priority: 10 },
      { pattern: commonPatterns.doubleQuoteString, type: 'string', priority: 9 },
      { pattern: commonPatterns.singleQuoteString, type: 'string', priority: 9 },
      { pattern: /\b(alignas|alignof|and|and_eq|asm|auto|bitand|bitor|bool|break|case|catch|char|char8_t|char16_t|char32_t|class|compl|concept|const|consteval|constexpr|constinit|const_cast|continue|co_await|co_return|co_yield|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|not|not_eq|nullptr|operator|or|or_eq|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while|xor|xor_eq)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(std|cout|cin|endl|vector|string|map|set|list|queue|stack|priority_queue|deque|array|unordered_map|unordered_set|pair|make_pair|shared_ptr|unique_ptr|weak_ptr|thread|mutex|condition_variable|future|promise|async|chrono|regex|optional|variant|any|function|bind|placeholders|algorithm|numeric|iterator|memory|utility|iostream|fstream|sstream|iomanip|cmath|cstdlib|cstring|ctime|cassert|climits|cfloat|cstdint|cstddef|cstdio|cstdarg|csignal|csetjmp|clocale|cerrno|cwchar|cwctype|cctype|ciso646|ccomplex|ctgmath|cinttypes|cuchar)\b/g, type: 'builtin', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'class', priority: 5 },
      { pattern: /\b[A-Z_][A-Z0-9_]*\b/g, type: 'constant', priority: 5 },
      { pattern: commonPatterns.number, type: 'number', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // C
  {
    languageId: 'c',
    rules: [
      { pattern: commonPatterns.singleLineComment, type: 'comment', priority: 10 },
      { pattern: commonPatterns.multiLineComment, type: 'comment', priority: 10 },
      { pattern: /#.*$/gm, type: 'macro', priority: 10 },
      { pattern: commonPatterns.doubleQuoteString, type: 'string', priority: 9 },
      { pattern: commonPatterns.singleQuoteString, type: 'string', priority: 9 },
      { pattern: /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|restrict|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|_Alignas|_Alignof|_Atomic|_Static_assert|_Noreturn|_Thread_local|_Generic|_Imaginary|_Complex|_Bool)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(NULL|true|false)\b/g, type: 'constant', priority: 8 },
      { pattern: /\b(printf|scanf|malloc|free|calloc|realloc|sizeof|strlen|strcpy|strcat|strcmp|strncmp|strncpy|strncat|memcpy|memset|memmove|memcmp|fopen|fclose|fread|fwrite|fgetc|fputc|fgets|fputs|fprintf|fscanf|fseek|ftell|rewind|fflush|getchar|putchar|gets|puts|atoi|atof|atol|itoa|abs|labs|rand|srand|exit|atexit|system|getenv|qsort|bsearch|div|ldiv|isalnum|isalpha|isblank|iscntrl|isdigit|isgraph|islower|isprint|ispunct|isspace|isupper|isxdigit|tolower|toupper|acos|asin|atan|atan2|cos|sin|tan|cosh|sinh|tanh|exp|log|log10|pow|sqrt|ceil|floor|fabs|fmod|frexp|ldexp|modf|signal|raise|setjmp|longjmp|time|clock|difftime|mktime|asctime|ctime|gmtime|localtime|strftime|va_start|va_arg|va_end|va_copy|offsetof|assert|errno|perror|strerror)\b/g, type: 'builtin', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'type', priority: 5 },
      { pattern: /\b[A-Z_][A-Z0-9_]*\b/g, type: 'constant', priority: 5 },
      { pattern: commonPatterns.number, type: 'number', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // C#
  {
    languageId: 'csharp',
    rules: [
      { pattern: commonPatterns.singleLineComment, type: 'comment', priority: 10 },
      { pattern: commonPatterns.multiLineComment, type: 'comment', priority: 10 },
      { pattern: /\/\/\/.*$/gm, type: 'docstring', priority: 9 },
      { pattern: commonPatterns.doubleQuoteString, type: 'string', priority: 9 },
      { pattern: commonPatterns.singleQuoteString, type: 'string', priority: 9 },
      { pattern: /@"(?:[^"]|"")*"/g, type: 'string', priority: 9 },
      { pattern: /\$"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
      { pattern: /\b(abstract|as|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|volatile|while|add|alias|ascending|async|await|by|descending|dynamic|equals|from|get|global|group|into|join|let|nameof|on|orderby|partial|remove|select|set|value|var|when|where|yield)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(true|false|null)\b/g, type: 'constant', priority: 8 },
      { pattern: /\b(Console|String|Int32|Int64|Double|Single|Boolean|Char|Byte|SByte|UInt16|UInt32|UInt64|Decimal|DateTime|TimeSpan|Guid|Object|Type|Array|List|Dictionary|HashSet|Queue|Stack|StringBuilder|Regex|Math|Convert|Environment|File|Directory|Path|Stream|StreamReader|StreamWriter|FileStream|MemoryStream|HttpClient|Task|Thread|CancellationToken|Exception|ArgumentException|ArgumentNullException|InvalidOperationException|NotImplementedException|NotSupportedException|IndexOutOfRangeException|NullReferenceException|FormatException|OverflowException|UnauthorizedAccessException|FileNotFoundException|DirectoryNotFoundException|IOException|TimeoutException|OutOfMemoryException|StackOverflowException|AppDomain|Assembly|Attribute|Enum|EventArgs|EventHandler|IDisposable|IEnumerable|ICollection|IList|IDictionary|IComparer|IEqualityComparer|ISerializable|ICloneable|IComparable|IFormattable|IConvertible)\b/g, type: 'builtin', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'class', priority: 5 },
      { pattern: /\b[A-Z_][A-Z0-9_]*\b/g, type: 'constant', priority: 5 },
      { pattern: /\[[^\]]*\]/g, type: 'annotation', priority: 5 },
      { pattern: commonPatterns.number, type: 'number', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // Go
  {
    languageId: 'go',
    rules: [
      { pattern: commonPatterns.singleLineComment, type: 'comment', priority: 10 },
      { pattern: commonPatterns.multiLineComment, type: 'comment', priority: 10 },
      { pattern: /`[^`]*`/g, type: 'string', priority: 9 },
      { pattern: commonPatterns.doubleQuoteString, type: 'string', priority: 9 },
      { pattern: commonPatterns.singleQuoteString, type: 'string', priority: 9 },
      { pattern: /\b(break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go|goto|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(true|false|nil|iota)\b/g, type: 'constant', priority: 8 },
      { pattern: /\b(bool|byte|complex64|complex128|error|float32|float64|int|int8|int16|int32|int64|rune|string|uint|uint8|uint16|uint32|uint64|uintptr|append|cap|close|complex|copy|delete|imag|len|make|new|panic|print|println|real|recover|fmt|os|io|net|http|json|time|sync|context|log|errors|strings|strconv|regexp|math|sort|bufio|bytes|crypto|encoding|flag|go|hash|html|image|index|mime|path|reflect|runtime|testing|text|unicode|unsafe|archive|compress|container|database|debug|expvar|plugin|builtin)\b/g, type: 'builtin', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'type', priority: 5 },
      { pattern: /\b[A-Z_][A-Z0-9_]*\b/g, type: 'constant', priority: 5 },
      { pattern: commonPatterns.number, type: 'number', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // Rust
  {
    languageId: 'rust',
    rules: [
      { pattern: commonPatterns.singleLineComment, type: 'comment', priority: 10 },
      { pattern: commonPatterns.multiLineComment, type: 'comment', priority: 10 },
      { pattern: /\/\/\/.*$/gm, type: 'docstring', priority: 9 },
      { pattern: /\/\*![\s\S]*?\*\//g, type: 'docstring', priority: 9 },
      { pattern: /r#*"(?:[^"\\]|\\.)*"#*/g, type: 'string', priority: 9 },
      { pattern: commonPatterns.doubleQuoteString, type: 'string', priority: 9 },
      { pattern: commonPatterns.singleQuoteString, type: 'string', priority: 9 },
      { pattern: /\b(as|async|await|break|const|continue|crate|dyn|else|enum|extern|false|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|true|type|union|unsafe|use|where|while|abstract|become|box|do|final|macro|override|priv|typeof|unsized|virtual|yield|try)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(true|false|None|Some)\b/g, type: 'constant', priority: 8 },
      { pattern: /\b(i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|String|Vec|HashMap|HashSet|BTreeMap|BTreeSet|LinkedList|VecDeque|BinaryHeap|Option|Result|Box|Rc|Arc|Cell|RefCell|Mutex|RwLock|Condvar|thread|sync|std|core|alloc|collections|io|fs|net|process|env|path|fmt|mem|ptr|slice|iter|ops|cmp|clone|copy|default|drop|debug|display|error|from|into|try_from|try_into|as_ref|as_mut|borrow|borrow_mut|to_owned|to_string|deref|deref_mut|index|add|remove|insert|contains|len|is_empty|clear|extend|drain|split|join|sort|reverse|shuffle|map|filter|fold|reduce|collect)\b/g, type: 'builtin', priority: 7 },
        { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
        { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'type', priority: 5 },
        { pattern: /\b[A-Z_][A-Z0-9_]*\b/g, type: 'constant', priority: 5 },
        { pattern: commonPatterns.number, type: 'number', priority: 4 },
        { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
        { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // PHP
  {
    languageId: 'php',
    rules: [
      { pattern: /\/\/.*$/gm, type: 'comment', priority: 10 },
      { pattern: /\/\*[\s\S]*?\*\//g, type: 'comment', priority: 10 },
      { pattern: /#.*$/gm, type: 'comment', priority: 10 },
      { pattern: /"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
      { pattern: /'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
      { pattern: /<<<['"]?(\w+)['"]?[\s\S]*?\n\1;/g, type: 'string', priority: 9 },
      { pattern: /\b(abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__CLASS__|__DIR__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|__NAMESPACE__|__TRAIT__)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(true|false|null|TRUE|FALSE|NULL)\b/g, type: 'constant', priority: 8 },
      { pattern: /\b(array|bool|boolean|int|integer|float|double|string|object|resource|mixed|callable|iterable|void|never|parent|self|static)\b/g, type: 'type', priority: 7 },
      { pattern: /\b(array_map|array_filter|array_reduce|array_merge|array_push|array_pop|array_shift|array_unshift|array_slice|array_splice|array_search|array_key_exists|array_keys|array_values|count|sizeof|strlen|substr|strpos|strtolower|strtoupper|trim|ltrim|rtrim|explode|implode|str_replace|preg_match|preg_replace|preg_split|file_get_contents|file_put_contents|fopen|fclose|fread|fwrite|json_encode|json_decode|serialize|unserialize|md5|sha1|hash|time|date|strtotime|microtime|memory_get_usage|memory_get_peak_usage|isset|empty|is_null|is_array|is_string|is_numeric|is_int|is_float|is_bool|is_object|is_resource|is_callable|var_dump|print_r|die|exit|header|setcookie|session_start|session_destroy|mysqli_connect|mysqli_query|mysqli_fetch_assoc|mysqli_close|PDO|Exception|ErrorException|InvalidArgumentException|LogicException|RuntimeException|OutOfBoundsException|OverflowException|UnderflowException|UnexpectedValueException|BadFunctionCallException|BadMethodCallException|DomainException|LengthException|OutOfRangeException|RangeException)\b/g, type: 'builtin', priority: 7 },
      { pattern: /\$[a-zA-Z_][a-zA-Z0-9_]*/g, type: 'variable', priority: 6 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'class', priority: 5 },
      { pattern: /\b[A-Z_][A-Z0-9_]*\b/g, type: 'constant', priority: 5 },
      { pattern: /\b\d+\.?\d*\b/g, type: 'number', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // Ruby
  {
    languageId: 'ruby',
    rules: [
      { pattern: /#.*$/gm, type: 'comment', priority: 10 },
      { pattern: /=begin[\s\S]*?=end/g, type: 'comment', priority: 10 },
      { pattern: /"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
      { pattern: /'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
      { pattern: /%[qQrwWxis]?[{([<][\s\S]*?[})\]>]/g, type: 'string', priority: 9 },
      { pattern: /\/(?:[^\/\\]|\\.)+\/[gimuy]*/g, type: 'regex', priority: 9 },
      { pattern: /\b(alias|and|begin|break|case|class|def|defined|do|else|elsif|end|ensure|false|for|if|in|module|next|nil|not|or|redo|rescue|retry|return|self|super|then|true|undef|unless|until|when|while|yield|__FILE__|__LINE__|__ENCODING__)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(true|false|nil|self|super)\b/g, type: 'constant', priority: 8 },
      { pattern: /\b(Array|Hash|String|Integer|Float|Symbol|TrueClass|FalseClass|NilClass|Object|Class|Module|Proc|Method|Binding|Thread|Fiber|Mutex|Monitor|ConditionVariable|Queue|SizedQueue|File|Dir|IO|StringIO|Tempfile|Pathname|URI|Time|Date|DateTime|Numeric|Complex|Rational|Range|Regexp|MatchData|Struct|OpenStruct|Set|SortedSet|Enumerator|StopIteration|Exception|StandardError|RuntimeError|SystemExit|Interrupt|SignalException|ArgumentError|IndexError|KeyError|NameError|NoMethodError|RangeError|RegexpError|RuntimeError|SecurityError|StandardError|SyntaxError|SystemCallError|SystemStackError|TypeError|ThreadError|ZeroDivisionError|FloatDomainError|IOError|EOFError|Errno|LoadError|NotImplementedError|ScriptError|LocalJumpError|SystemExit|Fatal|NoMemoryError)\b/g, type: 'builtin', priority: 7 },
      { pattern: /:[a-zA-Z_][a-zA-Z0-9_]*[?!]?/g, type: 'constant', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*[?!]?(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'class', priority: 5 },
      { pattern: /\b[A-Z_][A-Z0-9_]*\b/g, type: 'constant', priority: 5 },
      { pattern: /@[a-zA-Z_][a-zA-Z0-9_]*/g, type: 'variable', priority: 5 },
      { pattern: /@@[a-zA-Z_][a-zA-Z0-9_]*/g, type: 'variable', priority: 5 },
      { pattern: /\$[a-zA-Z_][a-zA-Z0-9_]*/g, type: 'variable', priority: 5 },
      { pattern: /\b\d+\.?\d*\b/g, type: 'number', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // Swift
  {
    languageId: 'swift',
    rules: [
      { pattern: /\/\/.*$/gm, type: 'comment', priority: 10 },
      { pattern: /\/\*[\s\S]*?\*\//g, type: 'comment', priority: 10 },
      { pattern: /"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
      { pattern: /'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
      { pattern: /"""[\s\S]*?"""/g, type: 'string', priority: 9 },
      { pattern: /\b(associatedtype|class|deinit|enum|extension|fileprivate|func|import|init|inout|internal|let|open|operator|private|protocol|public|static|struct|subscript|typealias|var|break|case|continue|default|defer|do|else|fallthrough|for|guard|if|in|repeat|return|switch|where|while|as|catch|false|is|nil|rethrows|super|self|Self|throws|throw|true|try|associativity|convenience|dynamic|didSet|final|get|infix|indirect|lazy|left|mutating|none|nonmutating|optional|override|postfix|precedence|prefix|Protocol|required|right|set|Type|unowned|weak|willSet)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(true|false|nil|self|Self|super)\b/g, type: 'constant', priority: 8 },
      { pattern: /\b(Int|Int8|Int16|Int32|Int64|UInt|UInt8|UInt16|UInt32|UInt64|Float|Double|Bool|String|Character|Array|Dictionary|Set|Optional|Result|Range|ClosedRange|PartialRangeFrom|PartialRangeUpTo|PartialRangeThrough|AnyObject|AnyClass|Any|NSObject|NSString|NSArray|NSDictionary|NSSet|NSNumber|NSData|NSDate|NSURL|NSError|Foundation|UIKit|SwiftUI|Combine|CoreData|CoreGraphics|QuartzCore|Metal|SceneKit|SpriteKit|GameplayKit|AVFoundation|Photos|MapKit|CoreLocation|UserNotifications|StoreKit|CloudKit|HealthKit|HomeKit|WatchKit|WatchConnectivity|NetworkExtension|ReplayKit|SafariServices|SiriKit|Speech|TVMLKit|TVServices|VideoSubscriberAccount|VideoToolbox|Vision|VisionKit|WebKit)\b/g, type: 'builtin', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'class', priority: 5 },
      { pattern: /\b[A-Z_][A-Z0-9_]*\b/g, type: 'constant', priority: 5 },
      { pattern: /@[a-zA-Z_][a-zA-Z0-9_]*/g, type: 'annotation', priority: 5 },
      { pattern: /\b\d+\.?\d*\b/g, type: 'number', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // Kotlin
  {
    languageId: 'kotlin',
    rules: [
      { pattern: /\/\/.*$/gm, type: 'comment', priority: 10 },
      { pattern: /\/\*[\s\S]*?\*\//g, type: 'comment', priority: 10 },
      { pattern: /"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
      { pattern: /'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
      { pattern: /"""[\s\S]*?"""/g, type: 'string', priority: 9 },
      { pattern: /\b(abstract|actual|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|dynamic|else|enum|expect|external|false|final|finally|for|fun|get|if|import|in|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|operator|out|override|package|private|protected|public|reified|return|sealed|set|super|suspend|tailrec|this|throw|true|try|typealias|typeof|val|var|vararg|when|where|while)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(true|false|null|this|super)\b/g, type: 'constant', priority: 8 },
      { pattern: /\b(Any|Nothing|Unit|Boolean|Byte|Short|Int|Long|Float|Double|Char|String|Array|List|MutableList|Set|MutableSet|Map|MutableMap|Collection|MutableCollection|Iterable|MutableIterable|Iterator|MutableIterator|ListIterator|MutableListIterator|Sequence|Pair|Triple|Result|Lazy|Delegate|ReadOnlyProperty|ReadWriteProperty|ObservableProperty|Comparable|Comparator|Enum|Annotation|Function|KClass|KFunction|KProperty|KMutableProperty|Throwable|Exception|RuntimeException|Error|AssertionError|ClassCastException|IllegalArgumentException|IllegalStateException|IndexOutOfBoundsException|KotlinNullPointerException|NoSuchElementException|NumberFormatException|UnsupportedOperationException|ConcurrentModificationException|OutOfMemoryError|StackOverflowError|Thread|Runnable|Synchronized|Volatile|Transient|StrictMath|System|Runtime|Process|ProcessBuilder|File|FileInputStream|FileOutputStream|FileReader|FileWriter|BufferedReader|BufferedWriter|PrintWriter|Scanner|Random|Math|Collections|Arrays|Regex|StringBuilder|StringBuffer|Date|Calendar|SimpleDateFormat|TimeZone|Locale|Properties|HashMap|HashSet|ArrayList|LinkedList|TreeMap|TreeSet|Stack|Queue|PriorityQueue|Vector|Hashtable|WeakHashMap|IdentityHashMap|LinkedHashMap|LinkedHashSet|TreeSet|EnumMap|EnumSet|ConcurrentHashMap|ConcurrentLinkedQueue|ConcurrentSkipListMap|ConcurrentSkipListSet|CopyOnWriteArrayList|CopyOnWriteArraySet|BlockingQueue|BlockingDeque|TransferQueue|SynchronousQueue|ArrayBlockingQueue|LinkedBlockingQueue|LinkedBlockingDeque|PriorityBlockingQueue|DelayQueue|Exchanger|Semaphore|CountDownLatch|CyclicBarrier|Phaser|Lock|ReadWriteLock|ReentrantLock|ReentrantReadWriteLock|StampedLock|Condition|Atomic|AtomicBoolean|AtomicInteger|AtomicLong|AtomicReference|AtomicReferenceArray|AtomicIntegerArray|AtomicLongArray|AtomicMarkableReference|AtomicStampedReference|Executor|ExecutorService|ThreadPoolExecutor|ScheduledExecutorService|ScheduledThreadPoolExecutor|ForkJoinPool|ForkJoinTask|RecursiveAction|RecursiveTask|CompletableFuture|Future|Callable|TimeUnit|ThreadFactory|RejectedExecutionHandler|ThreadLocal|InheritableThreadLocal|ThreadGroup|UncaughtExceptionHandler|SecurityManager|Permission|PermissionCollection|Permissions|AllPermission|BasicPermission|FilePermission|PropertyPermission|RuntimePermission|SecurityPermission|SerializablePermission|SocketPermission|SQLPermission|SSLPermission|AuthPermission|PrivateCredentialPermission|DelegationPermission|ServicePermission|AudioPermission|AWTPermission|LoggingPermission|ManagementPermission|MBeanPermission|MBeanServerPermission|MBeanTrustPermission|ReflectPermission|SubjectDelegationPermission|LinkPermission|NetPermission|ReflectPermission|PropertyPermission|RuntimePermission|SecurityPermission|SerializablePermission|SocketPermission|SQLPermission|SSLPermission|AuthPermission|PrivateCredentialPermission|DelegationPermission|ServicePermission|AudioPermission|AWTPermission|LoggingPermission|ManagementPermission|MBeanPermission|MBeanServerPermission|MBeanTrustPermission|ReflectPermission|SubjectDelegationPermission|LinkPermission|NetPermission)\b/g, type: 'builtin', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'class', priority: 5 },
      { pattern: /\b[A-Z_][A-Z0-9_]*\b/g, type: 'constant', priority: 5 },
      { pattern: /@[a-zA-Z_][a-zA-Z0-9_]*/g, type: 'annotation', priority: 5 },
      { pattern: /\b\d+\.?\d*\b/g, type: 'number', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // Scala
  {
    languageId: 'scala',
    rules: [
      { pattern: /\/\/.*$/gm, type: 'comment', priority: 10 },
      { pattern: /\/\*[\s\S]*?\*\//g, type: 'comment', priority: 10 },
      { pattern: /"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
      { pattern: /'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
      { pattern: /"""[\s\S]*?"""/g, type: 'string', priority: 9 },
      { pattern: /\b(abstract|case|catch|class|def|do|else|extends|false|final|finally|for|forSome|if|implicit|import|lazy|match|new|null|object|override|package|private|protected|return|sealed|super|this|throw|trait|true|try|type|val|var|while|with|yield)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(true|false|null|this|super|None|Some|Nil)\b/g, type: 'constant', priority: 8 },
      { pattern: /\b(Any|AnyRef|AnyVal|Nothing|Unit|Boolean|Byte|Short|Int|Long|Float|Double|Char|String|Array|List|Vector|Set|Map|Seq|Option|Some|None|Either|Left|Right|Try|Success|Failure|Future|Promise|Iterator|Iterable|Traversable|Stream|Range|Tuple|Product|Serializable|Cloneable|Comparable|Ordered|Ordering|Numeric|Integral|Fractional|BigInt|BigDecimal|StringBuilder|StringBuffer|Regex|Pattern|Matcher|Exception|Throwable|Error|RuntimeException|IllegalArgumentException|IllegalStateException|IndexOutOfBoundsException|NoSuchElementException|NullPointerException|ClassCastException|NumberFormatException|UnsupportedOperationException|ConcurrentModificationException|OutOfMemoryError|StackOverflowError|Thread|Runnable|Executor|ExecutorService|Future|Callable|TimeUnit|Duration|FiniteDuration|Deadline|ActorSystem|Actor|ActorRef|Props|Behavior|Scheduler|Timeout|Await|Promise|ExecutionContext|ExecutionContextExecutor|ExecutionContextExecutorService|BlockingExecutionContext|BatchingExecutor|SameThreadExecutionContext|CallingThreadExecutionContext|ForkJoinExecutionContext|ThreadPoolExecutionContext|QueuedExecutionContext|ExecutionContextExecutorServiceBridge|parasitic|directec|global|fromExecutor|fromExecutorService|fromThread|fromForkJoinPool|fromCachedThreadPool|fromFixedThreadPool|fromSingleThreadExecutor|fromScheduledThreadPool|fromWorkStealingPool|fromParallelism|fromThreadPoolExecutor|fromForkJoinPool|fromExecutorService|fromExecutor|fromThread|fromForkJoinPool|fromCachedThreadPool|fromFixedThreadPool|fromSingleThreadExecutor|fromScheduledThreadPool|fromWorkStealingPool|fromParallelism|fromThreadPoolExecutor)\b/g, type: 'builtin', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'class', priority: 5 },
      { pattern: /\b[A-Z_][A-Z0-9_]*\b/g, type: 'constant', priority: 5 },
      { pattern: /@[a-zA-Z_][a-zA-Z0-9_]*/g, type: 'annotation', priority: 5 },
      { pattern: /\b\d+\.?\d*\b/g, type: 'number', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // Dart
  {
    languageId: 'dart',
    rules: [
      { pattern: /\/\/.*$/gm, type: 'comment', priority: 10 },
      { pattern: /\/\*[\s\S]*?\*\//g, type: 'comment', priority: 10 },
      { pattern: /"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
      { pattern: /'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
      { pattern: /r"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
      { pattern: /r'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
      { pattern: /"""[\s\S]*?"""/g, type: 'string', priority: 9 },
      { pattern: /'''[\s\S]*?'''/g, type: 'string', priority: 9 },
      { pattern: /\b(abstract|as|assert|async|await|break|case|catch|class|const|continue|covariant|default|deferred|do|dynamic|else|enum|export|extends|extension|external|factory|false|final|finally|for|Function|get|hide|if|implements|import|in|interface|is|late|library|mixin|new|null|on|operator|part|required|rethrow|return|set|show|static|super|switch|sync|this|throw|true|try|typedef|var|void|while|with|yield)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(true|false|null|this|super)\b/g, type: 'constant', priority: 8 },
      { pattern: /\b(dynamic|void|var|Object|bool|int|double|num|String|List|Set|Map|Iterable|Iterator|Stream|Future|Completer|Duration|DateTime|RegExp|Match|RuneIterator|Runes|StringBuffer|StringSink|Stopwatch|Symbol|Type|Uri|UriData|BigInt|Comparable|Comparator|Enum|Exception|Error|AssertionError|TypeError|ArgumentError|RangeError|IndexError|NoSuchMethodError|UnsupportedError|UnimplementedError|StateError|ConcurrentModificationError|OutOfMemoryError|StackOverflowError|CyclicInitializationError|AbstractClassInstantiationError|NoSuchMethodError|UnsupportedError|UnimplementedError|StateError|ConcurrentModificationError|OutOfMemoryError|StackOverflowError|CyclicInitializationError|AbstractClassInstantiationError|FormatException|IntegerDivisionByZeroException|JsonUnsupportedObjectError|JsonCyclicError|Expando|WeakReference|Finalizer|Zone|ZoneDelegate|ZoneSpecification|Timer|Isolate|SendPort|ReceivePort|RawReceivePort|Capability|IsolateSpawnException|HttpClient|HttpClientRequest|HttpClientResponse|HttpHeaders|HttpStatus|WebSocket|WebSocketTransformer|Platform|Process|ProcessResult|ProcessSignal|ProcessStartMode|Directory|File|FileSystemEntity|FileSystemException|IOSink|RandomAccessFile|Stdin|Stdout|Stderr|Socket|ServerSocket|RawSocket|RawServerSocket|InternetAddress|NetworkInterface|SecureSocket|SecureServerSocket|X509Certificate|TlsException|HandshakeException|CertificateException|OSError|SocketException|FileSystemException|ProcessException|FormatException|TlsException|HandshakeException|CertificateException|HttpException|RedirectException|SocketException|WebSocketException|OSError|ProcessException|IsolateSpawnException|TimeoutException|UnhandledException|RpcException|RemoteException|ArgumentError|RangeError|IndexError|NoSuchMethodError|UnsupportedError|UnimplementedError|StateError|ConcurrentModificationError|OutOfMemoryError|StackOverflowError|CyclicInitializationError|AbstractClassInstantiationError|FormatException|IntegerDivisionByZeroException|JsonUnsupportedObjectError|JsonCyclicError|TlsException|HandshakeException|CertificateException|HttpException|RedirectException|SocketException|WebSocketException|OSError|ProcessException|IsolateSpawnException|TimeoutException|UnhandledException|RpcException|RemoteException)\b/g, type: 'builtin', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 6 },
      { pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g, type: 'class', priority: 5 },
      { pattern: /\b[A-Z_][A-Z0-9_]*\b/g, type: 'constant', priority: 5 },
      { pattern: /@[a-zA-Z_][a-zA-Z0-9_]*/g, type: 'annotation', priority: 5 },
      { pattern: /\b\d+\.?\d*\b/g, type: 'number', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // HTML
  {
    languageId: 'html',
    rules: [
      { pattern: /<!--[\s\S]*?-->/g, type: 'comment', priority: 10 },
      { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/g, type: 'comment', priority: 10 },
      { pattern: /<!DOCTYPE[^>]*>/gi, type: 'docstring', priority: 9 },
      { pattern: /"[^"]*"/g, type: 'string', priority: 9 },
      { pattern: /'[^']*'/g, type: 'string', priority: 9 },
      { pattern: /<\/?\b[a-zA-Z][a-zA-Z0-9\-]*\b/g, type: 'tag', priority: 8 },
      { pattern: /\b[a-zA-Z][a-zA-Z0-9\-]*(?=\s*=)/g, type: 'attribute', priority: 7 },
      { pattern: /&[a-zA-Z][a-zA-Z0-9]*;/g, type: 'entity', priority: 6 },
      { pattern: /&#[0-9]+;/g, type: 'entity', priority: 6 },
      { pattern: /&#x[0-9a-fA-F]+;/g, type: 'entity', priority: 6 },
      { pattern: /[<>\/=]/g, type: 'punctuation', priority: 2 },
    ]
  },

  // CSS
  {
    languageId: 'css',
    rules: [
      { pattern: /\/\*[\s\S]*?\*\//g, type: 'comment', priority: 10 },
      { pattern: /"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
      { pattern: /'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
      { pattern: /url\([^)]*\)/g, type: 'string', priority: 9 },
      { pattern: /@[a-zA-Z-]+/g, type: 'keyword', priority: 8 },
      { pattern: /\b(important|inherit|initial|unset|revert|auto|none|normal|bold|italic|underline|overline|line-through|solid|dashed|dotted|double|groove|ridge|inset|outset|hidden|visible|collapse|separate|fixed|scroll|local|static|relative|absolute|sticky|block|inline|inline-block|flex|grid|table|table-row|table-cell|left|right|center|justify|top|bottom|middle|baseline|start|end|stretch|space-between|space-around|space-evenly|wrap|nowrap|wrap-reverse|row|column|row-reverse|column-reverse|forwards|backwards|both|infinite|linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier|step-start|step-end|steps|alternate|alternate-reverse|reverse|normal|hidden|visible|clip|ellipsis|break-word|break-all|keep-all|nowrap)\b/g, type: 'keyword', priority: 8 },
      { pattern: /\b(color|background|border|margin|padding|width|height|max-width|max-height|min-width|min-height|font-size|font-family|font-weight|font-style|text-align|line-height|letter-spacing|word-spacing|text-decoration|text-transform|display|position|top|right|bottom|left|z-index|overflow|overflow-x|overflow-y|float|clear|visibility|opacity|transition|transform|animation)\b/g, type: 'property', priority: 7 },
      { pattern: /\b[a-zA-Z_][a-zA-Z0-9_-]*\b/g, type: 'selector', priority: 6 },
      { pattern: /#[a-fA-F0-9]{3,6}\b/g, type: 'color', priority: 5 },
      { pattern: /\b\d+(\.\d+)?(px|em|rem|vh|vw|vmin|vmax|\%|\w+)\b/g, type: 'length', priority: 4 },
      { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
      { pattern: /[{};:,]/g, type: 'punctuation', priority: 2 },
    ]
    },
    // scss
    {
        languageId: 'scss',
        rules: [
            { pattern: /\/\*[\s\S]*?\*\//g, type: 'comment', priority: 10 },
            { pattern: /"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
            { pattern: /'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
            { pattern: /url\([^)]*\)/g, type: 'string', priority: 9 },
            { pattern: /@[a-zA-Z-]+/g, type: 'keyword', priority: 8 },
            { pattern: /\b(important|inherit|initial|unset|revert|auto|none|normal|bold|italic|underline|overline|line-through|solid|dashed|dotted|double|groove|ridge|inset|outset|hidden|visible|collapse|separate|fixed|scroll|local|static|relative|absolute|sticky|block|inline|inline-block|flex|grid|table|table-row|table-cell)\b/g, type: 'keyword', priority: 8 },
            { pattern: /\b(color|background-color|border-color|max-width|max-height|min-width|min-height)\b/g, type: 'property', priority: 7 },
            { pattern: /\b[a-zA-Z_][a-zA-Z0-9_-]*\b/g, type: 'selector', priority: 6 },
            { pattern: /#[a-fA-F0-9]{3,6}\b/g, type: 'color', priority: 5 },
            { pattern: /\b\d+(\.\d+)?(px|em|rem|\%|\w+)\b/g, type: 'length', priority: 4 },
            { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
            { pattern: /[{};:,]/g, type: 'punctuation', priority: 2 },
        ]
    },
    // sass
    {
        languageId: 'sass',
        rules: [
            { pattern: /\/\*[\s\S]*?\*\//g, type: 'comment', priority: 10 },
            { pattern: /"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
            { pattern: /'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
            { pattern: /url\([^)]*\)/g, type: 'string', priority: 9 },
            { pattern: /@[a-zA-Z-]+/g, type: 'keyword', priority: 8 },
            { pattern: /\b(important|inherit|initial|unset|revert|auto|none|normal|bold|italic|underline|overline|line-through|solid|dashed|dotted|double|groove|ridge|inset|outset|hidden|visible)\b/g, type: 'keyword', priority: 8 },
            { pattern: /\b(color|max-width|max-height|min-width|min-height)\b/g, type: 'property', priority: 7 },
            { pattern: /\b[a-zA-Z_][a-zA-Z0-9_-]*\b/g, type: 'selector', priority: 6 },
            { pattern: /#[a-fA-F0-9]{3,6}\b/g, type: 'color', priority: 5 },
            { pattern: /\b\d+(\.\d+)?(px|em|rem|\%|\w+)\b/g, type: 'length', priority: 4 },
            { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 3 },
            { pattern: /[{};:,]/g, type: 'punctuation', priority: 2 },
        ]
    },
    // JSON
    {
        languageId: 'json',
        rules: [
            { pattern: /\/\/.*$/gm, type: 'comment', priority: 10 },
            { pattern: /\/\*[\s\S]*?\*\//g, type: 'comment', priority: 10 },
            { pattern: /"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
            { pattern: /:\s*"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
            { pattern: /:\s*'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
            { pattern: /true|false|null/g, type: 'constant', priority: 8 },
            { pattern: /\b\d+\.?\d*\b/g, type: 'number', priority: 7 },
            { pattern: /[{}[\],]/g, type: 'punctuation', priority: 2 },
            { pattern: /:/g, type: 'operator', priority: 3 },
        ]
    },
    // SQL
    {
        languageId: 'sql',
        rules: [
            { pattern: /--.*$/gm, type: 'comment', priority: 10 },
            { pattern: /\/\*[\s\S]*?\*\//g, type: 'comment', priority: 10 },
            { pattern: /"(?:[^"\\]|\\.)*"/g, type: 'string', priority: 9 },
            { pattern: /'(?:[^'\\]|\\.)*'/g, type: 'string', priority: 9 },
            { pattern: /\b(SELECT|FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|ON|GROUP BY|HAVING|ORDER BY|ASC|DESC|LIMIT|OFFSET|INSERT INTO|VALUES|UPDATE|SET|DELETE FROM|CREATE TABLE|ALTER TABLE|DROP TABLE|INDEX ON|UNION ALL|UNION DISTINCT)\b/g, type: 'keyword', priority: 8 },
            { pattern: /\b(AND|OR|NOT)\b/g, type: 'operator', priority: 7 },
            { pattern: /\b(TRUE|FALSE|null)\b/g, type: 'constant', priority: 6 },
            { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, type: 'function', priority: 5 },
            { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, type: 'identifier', priority: 4 },
            { pattern: /\b\d+\.?\d*\b/g, type: 'number', priority: 3 },
            { pattern: /[+\-*/%=<>!&|^~?:]/g, type: 'operator', priority: 2 },
            { pattern: /[{}[\]();,.]/g, type: 'punctuation', priority: 1 },
        ]
    }
];