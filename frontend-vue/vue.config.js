module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      // List native deps here if they don't work
      externals: ['firebase'],
      // If you are using Yarn Workspaces, you may have multiple node_modules folders
      // List them all here so that VCP Electron Builder can find them
      nodeModulesPath: ['./node_modules']
    },
    PWA: {
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
          swSrc: 'src/service-worker.js'
      },
      themeColor: '#1da025'
    }

  },
  // configureWebpack: {
  //   externals: [function (context, request, callback) {
  //     if (/^@firebase/.test(request)) {
  //       return callback(null, 'commonjs2 ' + request);
  //       // Externalize to a commonjs module using the request path 
  //     }

  //     callback();
  //   }]

  // }
  // ,

  outputDir: '../backend-firebase/public'
}