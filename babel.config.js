module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [
    // 这块是增加的prismjs的配置
    [
      'prismjs',
      {
        languages: ['javascript', 'css', 'markup'],
        plugins: ['line-numbers'],
        theme: 'tomorrow',
        css: false,
      },
    ],
  ],
};
