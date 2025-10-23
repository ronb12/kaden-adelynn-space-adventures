module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find and modify the HtmlWebpackPlugin to fix preload warnings
      const htmlPluginIndex = webpackConfig.plugins.findIndex(
        plugin => plugin.constructor.name === 'HtmlWebpackPlugin'
      );
      
      if (htmlPluginIndex !== -1) {
        const htmlPlugin = webpackConfig.plugins[htmlPluginIndex];
        
        // Override the template parameters to add proper 'as' attributes
        const originalTemplateParameters = htmlPlugin.options.templateParameters;
        
        htmlPlugin.options.templateParameters = (compilation, assets, assetTags, options) => {
          const result = originalTemplateParameters ? 
            originalTemplateParameters(compilation, assets, assetTags, options) :
            { compilation, assets, assetTags, options };
          
          // Modify the asset tags to add proper 'as' attributes
          if (result.htmlWebpackPlugin && result.htmlWebpackPlugin.tags) {
            const tags = result.htmlWebpackPlugin.tags;
            
            // Fix head tags (preload links)
            if (tags.headTags) {
              tags.headTags = tags.headTags.map(tag => {
                if (tag.tagName === 'link' && tag.attributes && tag.attributes.rel === 'preload') {
                  // Determine the 'as' attribute based on the file type
                  const href = tag.attributes.href;
                  if (href && href.includes('.css')) {
                    tag.attributes.as = 'style';
                  } else if (href && href.includes('.js')) {
                    tag.attributes.as = 'script';
                  }
                }
                return tag;
              });
            }
          }
          
          return result;
        };
      }
      
      return webpackConfig;
    }
  }
};
