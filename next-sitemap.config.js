module.exports = {
    siteUrl: 'https://wifi-menu.ro',
    generateRobotsTxt: true,
    exclude: ['/server-sitemap.xml'], // Exclude dynamic sitemap from static generation
    robotsTxtOptions: {
      additionalSitemaps: [
        'https://wifi-menu.ro/server-sitemap.xml', // Add dynamic sitemap here
      ],
      policies: [
        {
            userAgent: '*',
            disallow: ['/dashboard']
        }
      ]
    },
  }