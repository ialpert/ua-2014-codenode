'use strict';

/**
 * @ngdoc function
 * @name language
 * @description
 * # room
 * Stores the list of available programming languages
 */
angular.module('interviewer')
  .value('Languages', [{value: "abap", name: "ABAP"},
    {value: "actionscript", name: "ActionScript"},
    {value: "ada", name: "ADA"},
    {value: "apache_conf", name: "Apache Conf"},
    {value: "asciidoc", name: "AsciiDoc"},
    {value: "assembly_x86", name: "Assembly x86"},
    {value: "autohotkey", name: "AutoHotKey"},
    {value: "batchfile", name: "BatchFile"},
    {value: "c9search", name: "C9Search"},
    {value: "c_cpp", name: "C and C++"},
    {value: "cirru", name: "Cirru"},
    {value: "clojure", name: "Clojure"},
    {value: "cobol", name: "Cobol"},
    {value: "coffee", name: "CoffeeScript"},
    {value: "coldfusion", name: "ColdFusion"},
    {value: "csharp", name: "C#"},
    {value: "css", name: "CSS"},
    {value: "curly", name: "Curly"},
    {value: "d", name: "D"},
    {value: "dart", name: "Dart"},
    {value: "diff", name: "Diff"},
    {value: "dockerfile", name: "Dockerfile"},
    {value: "dot", name: "Dot"},
    {value: "dummy", name: "Dummy"},
    {value: "dummysyntax", name: "DummySyntax"},
    {value: "eiffel", name: "Eiffel"},
    {value: "ejs", name: "EJS"},
    {value: "elixir", name: "Elixir"},
    {value: "elm", name: "Elm"},
    {value: "erlang", name: "Erlang"},
    {value: "forth", name: "Forth"},
    {value: "ftl", name: "FreeMarker"},
    {value: "gcode", name: "Gcode"},
    {value: "gherkin", name: "Gherkin"},
    {value: "gitignore", name: "Gitignore"},
    {value: "glsl", name: "Glsl"},
    {value: "golang", name: "Go"},
    {value: "groovy", name: "Groovy"},
    {value: "haml", name: "HAML"},
    {value: "handlebars", name: "Handlebars"},
    {value: "haskell", name: "Haskell"},
    {value: "haxe", name: "haXe"},
    {value: "html", name: "HTML"},
    {value: "html_ruby", name: "HTML (Ruby)"},
    {value: "ini", name: "INI"},
    {value: "io", name: "Io"},
    {value: "jack", name: "Jack"},
    {value: "jade", name: "Jade"},
    {value: "java", name: "Java"},
    {value: "javascript", name: "JavaScript"},
    {value: "json", name: "JSON"},
    {value: "jsoniq", name: "JSONiq"},
    {value: "jsp", name: "JSP"},
    {value: "jsx", name: "JSX"},
    {value: "julia", name: "Julia"},
    {value: "latex", name: "LaTeX"},
    {value: "less", name: "LESS"},
    {value: "liquid", name: "Liquid"},
    {value: "lisp", name: "Lisp"},
    {value: "livescript", name: "LiveScript"},
    {value: "logiql", name: "LogiQL"},
    {value: "lsl", name: "LSL"},
    {value: "lua", name: "Lua"},
    {value: "luapage", name: "LuaPage"},
    {value: "lucene", name: "Lucene"},
    {value: "makefile", name: "Makefile"},
    {value: "markdown", name: "Markdown"},
    {value: "matlab", name: "MATLAB"},
    {value: "mel", name: "MEL"},
    {value: "mushcode", name: "MUSHCode"},
    {value: "mysql", name: "MySQL"},
    {value: "nix", name: "Nix"},
    {value: "objectivec", name: "Objective-C"},
    {value: "ocaml", name: "OCaml"},
    {value: "pascal", name: "Pascal"},
    {value: "perl", name: "Perl"},
    {value: "pgsql", name: "pgSQL"},
    {value: "php", name: "PHP"},
    {value: "powershell", name: "Powershell"},
    {value: "praat", name: "Praat"},
    {value: "prolog", name: "Prolog"},
    {value: "properties", name: "Properties"},
    {value: "protobuf", name: "Protobuf"},
    {value: "python", name: "Python"},
    {value: "r", name: "R"},
    {value: "rdoc", name: "RDoc"},
    {value: "rhtml", name: "RHTML"},
    {value: "ruby", name: "Ruby"},
    {value: "rust", name: "Rust"},
    {value: "sass", name: "SASS"},
    {value: "scad", name: "SCAD"},
    {value: "scala", name: "Scala"},
    {value: "scheme", name: "Scheme"},
    {value: "scss", name: "SCSS"},
    {value: "sh", name: "SH"},
    {value: "sjs", name: "SJS"},
    {value: "smarty", name: "Smarty"},
    {value: "snippets", name: "snippets"},
    {value: "soy_template", name: "Soy Template"},
    {value: "space", name: "Space"},
    {value: "sql", name: "SQL"},
    {value: "stylus", name: "Stylus"},
    {value: "svg", name: "SVG"},
    {value: "tcl", name: "Tcl"},
    {value: "tex", name: "Tex"},
    {value: "text", name: "Text"},
    {value: "textile", name: "Textile"},
    {value: "toml", name: "Toml"},
    {value: "twig", name: "Twig"},
    {value: "typescript", name: "Typescript"},
    {value: "vala", name: "Vala"},
    {value: "vbscript", name: "VBScript"},
    {value: "velocity", name: "Velocity"},
    {value: "verilog", name: "Verilog"},
    {value: "vhdl", name: "VHDL"},
    {value: "xml", name: "XML"},
    {value: "xquery", name: "XQuery"},
    {value: "yaml", name: "YAML"}
  ]);