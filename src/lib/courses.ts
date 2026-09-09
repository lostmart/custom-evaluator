// Static registry of all course data.
// Importing JSON statically lets the bundler tree-shake and typecheck the data.

import type courseIndex from "@/assets/courses/index.json";

export type CourseIndexEntry = (typeof courseIndex)[number];

export type ExternalLink = { label: string; url: string };

export type Exercise = {
  id: string;
  type: "multiple-choice" | "fill-in" | "code";
  difficulty: string;
  prompt: string;
  options?: string[];
  answer?: string;
  explanation?: string;
  code?: string;
  hint?: string;
  solution?: string;
};

export type Topic = {
  id: string;
  courseId: string;
  title: string;
  summary: string;
  keyPoints: string[];
  externalLinks: ExternalLink[];
  exercises: Exercise[];
};

export type CourseData = {
  id: string;
  title: string;
  description: string;
  topics: { id: string; title: string }[];
  topicsMap: Record<string, Topic>;
};

// ── bash-scripting ────────────────────────────────────────────────────────────
import bsIoRedirection from "@/assets/courses/bash-scripting/topics/io-redirection.json";
import bsFileTests from "@/assets/courses/bash-scripting/topics/file-tests.json";
import bsArrays from "@/assets/courses/bash-scripting/topics/arrays.json";
import bsCaseStatements from "@/assets/courses/bash-scripting/topics/case-statements.json";
import bsFunctions from "@/assets/courses/bash-scripting/topics/functions.json";
import bsRegex from "@/assets/courses/bash-scripting/topics/regex.json";
import bsAwk from "@/assets/courses/bash-scripting/topics/awk.json";
import bsMeta from "@/assets/courses/bash-scripting/meta.json";

// ── linux-fundamentals ────────────────────────────────────────────────────────
import lfFileManagement from "@/assets/courses/linux-fundamentals/topics/file-management.json";
import lfIoRedirection from "@/assets/courses/linux-fundamentals/topics/io-redirection.json";
import lfVariablesQuoting from "@/assets/courses/linux-fundamentals/topics/variables-quoting.json";
import lfConditionals from "@/assets/courses/linux-fundamentals/topics/conditionals.json";
import lfLoops from "@/assets/courses/linux-fundamentals/topics/loops.json";
import lfFunctions from "@/assets/courses/linux-fundamentals/topics/functions.json";
import lfSed from "@/assets/courses/linux-fundamentals/topics/sed.json";
import lfAwk from "@/assets/courses/linux-fundamentals/topics/awk.json";
import lfArrays from "@/assets/courses/linux-fundamentals/topics/arrays.json";
import lfMeta from "@/assets/courses/linux-fundamentals/meta.json";

// ── python-microservices ──────────────────────────────────────────────────────
import pmBoundedContext from "@/assets/courses/python-microservices/topics/bounded-context.json";
import pmServiceCommunication from "@/assets/courses/python-microservices/topics/service-communication.json";
import pmApiGateway from "@/assets/courses/python-microservices/topics/api-gateway.json";
import pmLayeredArchitecture from "@/assets/courses/python-microservices/topics/layered-architecture.json";
import pmDatabaseMigrations from "@/assets/courses/python-microservices/topics/database-migrations.json";
import pmResilience from "@/assets/courses/python-microservices/topics/resilience.json";
import pmMeta from "@/assets/courses/python-microservices/meta.json";

// ── typescript-react ──────────────────────────────────────────────────────────
import trMeta from "@/assets/courses/typescript-react/meta.json";
import trTypeAnnotations from "@/assets/courses/typescript-react/topics/type-annotations.json";
import trInterfaces from "@/assets/courses/typescript-react/topics/interfaces.json";
import trUnionTypes from "@/assets/courses/typescript-react/topics/union-types.json";
import trGenerics from "@/assets/courses/typescript-react/topics/generics.json";
import trReactProps from "@/assets/courses/typescript-react/topics/react-props.json";
import trReactEvents from "@/assets/courses/typescript-react/topics/react-events.json";
import trReactHooks from "@/assets/courses/typescript-react/topics/react-hooks.json";
import trAsyncTyping from "@/assets/courses/typescript-react/topics/async-typing.json";
import trUtilityTypes from "@/assets/courses/typescript-react/topics/utility-types.json";

// ── modern-js ─────────────────────────────────────────────────────────────────
import fefMeta from "@/assets/courses/modern-js/meta.json";
import jsConstLet from "@/assets/courses/modern-js/topics/const-let.json";
import jsArrowFunctions from "@/assets/courses/modern-js/topics/arrow-functions.json";
import jsDestructuring from "@/assets/courses/modern-js/topics/destructuring.json";
import jsTemplateLiterals from "@/assets/courses/modern-js/topics/template-literals.json";
import jsSpreadRest from "@/assets/courses/modern-js/topics/spread-rest.json";
import jsModules from "@/assets/courses/modern-js/topics/modules.json";
import jsArrayMethods from "@/assets/courses/modern-js/topics/array-methods.json";
import jsAsyncAwait from "@/assets/courses/modern-js/topics/async-await.json";
import jsOptionalChaining from "@/assets/courses/modern-js/topics/optional-chaining.json";

// ── registry ──────────────────────────────────────────────────────────────────

function toMap(topics: Topic[]): Record<string, Topic> {
  return Object.fromEntries(topics.map((t) => [t.id, t]));
}

export const courses: Record<string, CourseData> = {
  "bash-scripting": {
    ...bsMeta,
    topicsMap: toMap([
      bsIoRedirection,
      bsFileTests,
      bsArrays,
      bsCaseStatements,
      bsFunctions,
      bsRegex,
      bsAwk,
    ] as Topic[]),
  },
  "linux-fundamentals": {
    ...lfMeta,
    topicsMap: toMap([
      lfFileManagement,
      lfIoRedirection,
      lfVariablesQuoting,
      lfConditionals,
      lfLoops,
      lfFunctions,
      lfSed,
      lfAwk,
      lfArrays,
    ] as Topic[]),
  },
  "python-microservices": {
    ...pmMeta,
    topicsMap: toMap([
      pmBoundedContext,
      pmServiceCommunication,
      pmApiGateway,
      pmLayeredArchitecture,
      pmDatabaseMigrations,
      pmResilience,
    ] as Topic[]),
  },
  "modern-js": {
    ...fefMeta,
    topicsMap: toMap([
      jsConstLet,
      jsArrowFunctions,
      jsDestructuring,
      jsTemplateLiterals,
      jsSpreadRest,
      jsModules,
      jsArrayMethods,
      jsAsyncAwait,
      jsOptionalChaining,
    ] as Topic[]),
  },
  "typescript-react": {
    ...trMeta,
    topicsMap: toMap([
      trTypeAnnotations,
      trInterfaces,
      trUnionTypes,
      trGenerics,
      trReactProps,
      trReactEvents,
      trReactHooks,
      trAsyncTyping,
      trUtilityTypes,
    ] as Topic[]),
  },
};
