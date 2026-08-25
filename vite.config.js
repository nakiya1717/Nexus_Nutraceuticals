import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'rewrite-careers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // If URL is exactly /careers or /careers/, serve careers.html
          if (req.url.split('?')[0] === '/careers' || req.url.split('?')[0] === '/careers/') {
            req.url = '/careers.html';
          } 
          // If URL starts with /careers/ followed by slug (no dots), serve career-details.html
          else if (req.url.startsWith('/careers/') && !req.url.includes('.')) {
            req.url = '/career-details.html';
          }
          next();
        });
      }
    }
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        benefits: './benefits.html',
        blog: './blog.html',
        article: './article.html',
        privacyPolicy: './privacy-policy.html',
        refundPolicy: './refund-return-policy.html',
        shippingPolicy: './shipping-policy.html',
        termsOfService: './terms-of-service.html',
        careers: './careers.html',
        careerDetails: './career-details.html',
        certificates: './certificates.html'
      }
    }
  }
});
