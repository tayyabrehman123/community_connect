module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};

// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: ['nativewind/babel'], // This must be here
//   };
// };

// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: [
//       ["babel-preset-expo", { jsxImportSource: "nativewind" }],
//     ],
//     plugins: ["nativewind/babel"], // This is where nativewind belongs
//   };
// };
