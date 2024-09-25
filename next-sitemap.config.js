module.exports = {
  siteUrl: "https://wifi-menu.ro",
  generateRobotsTxt: true,
  exclude: ["/server-sitemap.xml"],
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://wifi-menu.ro/server-sitemap.xml",
    ],
    policies: [
      {
        userAgent: "*",
        disallow: [
          "/dashboard",
          "/*.json$",
          "/*_buildManifest.js$",
          "/*_middlewareManifest.js$",
          "/*_ssgManifest.js$",
          "/*.js$",
        ],
        allow: [
          "/",
          "/cookie-policy",
          "/refund-policy",
          "/privacy-policy",
          "/terms-and-conditions",
          "/contact",
          "/despre-noi",
          "/blog",
          "/blog/*"
        ],
      },
    ],
  },
  transform: async (config, path) => {
    if (path === '/blog') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      };
    }
    
    if (path.startsWith('/blog/')) {
      const { db } = require('./utils/firebase');
      const { collection, getDocs, query, where } = require('firebase/firestore');
      const postsRef = collection(db, 'blog_posts');
      const q = query(postsRef, where('published', '==', true));
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const post = posts.find(p => `/blog/${p.slug}` === path);
      if (post) {
        return {
          loc: path,
          changefreq: 'weekly',
          priority: 0.6,
          lastmod: post.updatedAt.toDate().toISOString(),
        };
      }
    }
    
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
