module.exports = grammar({
  name: "wasp",

  // Extras are tokens that can appear anywhere (like whitespace and comments)
  extras: ($) => [/\s/, $.comment],

  rules: {
    source_file: ($) => repeat($.declaration),

    declaration: ($) =>
      seq($.declaration_type, $.identifier, $.declaration_body),

    declaration_type: ($) =>
      choice(
        "action",
        "apiNamespace",
        "api",
        "app",
        "entity",
        "job",
        "page",
        "query",
        "route",
        "crud",
      ),

    declaration_body: ($) => choice($.dict, $.prisma_closure, $.json_closure),

    dict: ($) => seq("{", commaSep($.dict_pair), "}"),

    dict_pair: ($) => seq($.identifier, ":", $.value),

    array: ($) => seq("[", commaSep($.value), "]"),

    value: ($) =>
      choice(
        $.string,
        $.number,
        $.boolean,
        $.enum_value,
        $.js_import,
        $.prisma_closure,
        $.json_closure,
        $.array,
        $.dict,
        $.identifier,
      ),

    identifier: ($) => /[a-zA-Z][0-9a-zA-Z]*/,

    string: ($) => /"([^"\\]|\\.)*"/,

    number: ($) => /\d+(\.\d+)?/,

    boolean: ($) => choice("true", "false"),

    enum_value: ($) =>
      choice(
        "EmailAndPassword",
        "PostgreSQL",
        "SQLite",
        "Simple",
        "PgBoss",
        "SMTP",
        "SendGrid",
        "Mailgun",
        "Dummy",
      ),

    js_import: ($) =>
      seq(
        "import",
        choice($.identifier, seq("{", $.identifier, "}")),
        "from",
        $.string,
      ),

    // Handles the special {=psl ... psl=} blocks safely without breaking the lexer
    prisma_closure: ($) =>
      seq("{=psl", optional(alias($._closure_text, $.prisma_content)), "psl=}"),

    // Handles the special {=json ... json=} blocks
    json_closure: ($) =>
      seq("{=json", optional(alias($._closure_text, $.json_content)), "json=}"),

    // Use a low precedence token to capture all contents inside closures up to the delimiter
    _closure_text: ($) => token(prec(-1, repeat1(choice(/[^\n]/, "\n")))),

    comment: ($) =>
      choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
  },
});

function commaSep(rule) {
  return optional(seq(rule, repeat(seq(",", rule)), optional(",")));
}
