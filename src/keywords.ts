// Hand-transcribed from the compiler's lexer keyword table
// (userspace/dsl/core/src/lexer.rs) and docs/dev/dsl/grammar.md.
export interface KeywordDoc {
  name: string;
  detail: string;
}

export const DECLARATION_KEYWORDS: KeywordDoc[] = [
  { name: 'Store', detail: 'Store Name { field: Type = default, … }' },
  { name: 'Event', detail: 'Event Name { Case, Case(Type), … }' },
  { name: 'reduce', detail: 'reduce EventName { Pattern => Stmt, … }' },
  { name: 'Page', detail: 'Page Name { <view> }' },
  { name: 'Component', detail: 'Component Name { props: { … } <view> }' },
  { name: 'Routes', detail: 'Routes { "path" -> Page, … }' },
  { name: 'Window', detail: 'Window { style: …, mode: …, level: …, resizable: … }' },
  { name: 'Query', detail: 'Query Name on Store { params: {…}, where …, orderBy …, limit N }' },
  { name: 'props', detail: 'props: { field: Type, … }' },
  { name: 'import', detail: 'import "path"' },
];

export const CONTROL_KEYWORDS: KeywordDoc[] = [
  { name: 'if', detail: 'if <expr> { … } else { … }' },
  { name: 'else', detail: 'else { … }' },
  { name: 'match', detail: 'match <expr> { Pattern => …, … }' },
  { name: 'for', detail: 'for x in <bounded expr> { … }' },
  { name: 'in', detail: 'used in for … in … and List(expr) { item in … }' },
  { name: 'on', detail: 'on EventName -> emit(...) | dispatch(...)' },
  { name: 'navigate', detail: 'navigate("path")' },
  { name: 'dispatch', detail: 'dispatch(EventCase(args…))' },
  { name: 'emit', detail: 'emit(propEventRef)' },
  { name: 'let', detail: 'let name = <expr>;' },
];

export const OTHER_KEYWORDS: KeywordDoc[] = [
  { name: 'svc', detail: 'svc.<service>.<method>(args…, timeoutMs: N) — @effect bodies only' },
  { name: 'device', detail: 'device.<field> — read-only environment (profile, posture, …)' },
  { name: 'state', detail: 'state.<field> — reducer-body place expression' },
];
