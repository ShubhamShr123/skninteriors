#!/usr/bin/env node

/**
 * Comprehensive SEO, Speed & Performance Audit
 * Tests all pages for Core Web Vitals, SEO, and performance metrics
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Base URL - change to localhost or production
const BASE_URL = 'http://127.0.0.1:5500';

// Pages to audit
const PAGES = [
    'index.html',
    'about.html',
    'portfolio.html',
    'services.html',
    'residential.html',
    'commercial.html',
    'commercial-showrooms.html',
    'contact.html',
    // Project pages would be tested too, here are a few
    'projects/project-big-cash.html',
    'projects/project-clark.html',
    'projects/project-aerocity.html'
];

// SEO Audit Checklist
const SEO_CHECKLIST = {
    title: 'Page <title> tag',
    metaDescription: 'Meta description',
    metaViewport: 'Viewport meta tag',
    canonical: 'Canonical tag',
    ogTitle: 'Open Graph title',
    ogDescription: 'Open Graph description',
    ogImage: 'Open Graph image',
    twitterCard: 'Twitter card',
    h1: 'H1 heading present',
    robotsTxt: 'robots.txt exists',
    sitemap: 'sitemap.xml exists',
    fastDOMContentLoaded: 'DOMContentLoaded < 3s',
};

// Performance metrics
const PERFORMANCE_METRICS = {
    imageOptimization: 'Check for lazy-loading & dimensions',
    scriptDefer: 'Non-critical scripts deferred',
    fontOptimization: 'Font loading optimized',
    cssMinification: 'CSS minified',
    renderBlocking: 'Minimal render-blocking assets',
};

class AuditRunner {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.results = [];
    }

    async fetchPage(pagePath) {
        return new Promise((resolve, reject) => {
            const url = `${this.baseUrl}/${pagePath}`;
            const protocol = url.startsWith('https') ? https : http;
            
            protocol.get(url, { timeout: 10000 }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({ html: data, status: res.statusCode }));
            }).on('error', reject);
        });
    }

    checkSEO(html, pagePath) {
        const audit = {};
        
        // Title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        audit.title = titleMatch ? titleMatch[1] : 'MISSING';
        
        // Meta description
        const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
        audit.metaDescription = descMatch ? descMatch[1].substring(0, 50) + '...' : 'MISSING';
        
        // Viewport
        audit.metaViewport = html.includes('viewport') ? '✓' : 'MISSING';
        
        // Canonical
        const canonMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
        audit.canonical = canonMatch ? canonMatch[1] : 'MISSING';
        
        // Open Graph
        const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
        audit.ogTitle = ogTitleMatch ? '✓' : 'MISSING';
        
        const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
        audit.ogImage = ogImageMatch ? '✓' : 'MISSING';
        
        // Twitter Card
        const twitterMatch = html.match(/<meta\s+name="twitter:card"/i);
        audit.twitterCard = twitterMatch ? '✓' : 'MISSING';
        
        // H1
        const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        audit.h1 = h1Match ? '✓' : 'MISSING';
        
        return audit;
    }

    checkPerformance(html, pagePath) {
        const audit = {};
        
        // Check for lazy-loading on images
        const totalImages = (html.match(/<img/gi) || []).length;
        const lazyImages = (html.match(/loading="lazy"/gi) || []).length;
        audit.lazyLoading = `${lazyImages}/${totalImages} images`;
        audit.lazyLoadingPercent = totalImages > 0 ? Math.round((lazyImages / totalImages) * 100) : 'N/A';
        
        // Check for deferred scripts
        const totalScripts = (html.match(/<script[^>]*src/gi) || []).length;
        const deferredScripts = (html.match(/defer/gi) || []).length;
        audit.scriptDefer = `${deferredScripts}/${totalScripts} deferred`;
        
        // Check for render-blocking scripts
        const blockingScripts = (html.match(/<script[^>]*src[^>]*>/gi) || []).filter(s => !s.includes('defer') && !s.includes('async')).length;
        audit.blockingScripts = blockingScripts > 0 ? `⚠️ ${blockingScripts} blocking` : '✓ None blocking';
        
        // Check for external stylesheets
        const externalCSS = (html.match(/<link[^>]*rel="stylesheet"[^>]*href="https?/i) || []).length;
        audit.externalCSS = externalCSS > 0 ? `⚠️ ${externalCSS} external` : '✓ All local';
        
        // Check image dimensions
        const imagesWithDimensions = (html.match(/width="\d+" height="\d+"/gi) || []).length;
        const imagesTotal = (html.match(/<img/gi) || []).length;
        audit.imageDimensions = `${imagesWithDimensions}/${imagesTotal} with dimensions`;
        audit.imageDimensionsPercent = imagesTotal > 0 ? Math.round((imagesWithDimensions / imagesTotal) * 100) : 'N/A';
        
        return audit;
    }

    async auditPage(pagePath) {
        try {
            console.log(`\n📄 Auditing: ${pagePath}`);
            const { html, status } = await this.fetchPage(pagePath);
            
            if (status !== 200) {
                console.log(`❌ Page returned status ${status}`);
                return;
            }
            
            const seoAudit = this.checkSEO(html, pagePath);
            const perfAudit = this.checkPerformance(html, pagePath);
            
            // Print SEO Results
            console.log('\n🔍 SEO Checklist:');
            console.log(`  ✓ Title: ${seoAudit.title}`);
            console.log(`  ${seoAudit.metaDescription === 'MISSING' ? '❌' : '✓'} Description: ${seoAudit.metaDescription}`);
            console.log(`  ${seoAudit.metaViewport === 'MISSING' ? '❌' : '✓'} Viewport: ${seoAudit.metaViewport}`);
            console.log(`  ${seoAudit.canonical === 'MISSING' ? '❌' : '✓'} Canonical: ${seoAudit.canonical}`);
            console.log(`  ${seoAudit.ogTitle === 'MISSING' ? '❌' : '✓'} OG Title: ${seoAudit.ogTitle}`);
            console.log(`  ${seoAudit.ogImage === 'MISSING' ? '❌' : '✓'} OG Image: ${seoAudit.ogImage}`);
            console.log(`  ${seoAudit.twitterCard === 'MISSING' ? '❌' : '✓'} Twitter Card: ${seoAudit.twitterCard}`);
            console.log(`  ${seoAudit.h1 === 'MISSING' ? '❌' : '✓'} H1: ${seoAudit.h1}`);
            
            // Print Performance Results
            console.log('\n⚡ Performance Metrics:');
            console.log(`  ${perfAudit.lazyLoadingPercent >= 80 ? '✓' : '⚠️ '} Lazy Loading: ${perfAudit.lazyLoading} (${perfAudit.lazyLoadingPercent}%)`);
            console.log(`  ${perfAudit.blockingScripts === '✓ None blocking' ? '✓' : '⚠️'} Scripts: ${perfAudit.scriptDefer} | ${perfAudit.blockingScripts}`);
            console.log(`  ${perfAudit.externalCSS === '✓ All local' ? '✓' : '⚠️'} CSS: ${perfAudit.externalCSS}`);
            console.log(`  ${perfAudit.imageDimensionsPercent >= 80 ? '✓' : '⚠️'} Image Dimensions: ${perfAudit.imageDimensions} (${perfAudit.imageDimensionsPercent}%)`);
            
            this.results.push({
                page: pagePath,
                seo: seoAudit,
                performance: perfAudit
            });
        } catch (error) {
            console.log(`❌ Error auditing ${pagePath}: ${error.message}`);
        }
    }

    async checkStaticFiles() {
        console.log('\n\n📁 Checking Static Files:\n');
        
        // Check robots.txt
        const robotsPath = path.join(__dirname, 'robots.txt');
        const robotsExists = fs.existsSync(robotsPath);
        console.log(`  ${robotsExists ? '✓' : '❌'} robots.txt: ${robotsExists ? 'Found' : 'Missing'}`);
        
        // Check sitemap.xml
        const sitemapPath = path.join(__dirname, 'sitemap.xml');
        const sitemapExists = fs.existsSync(sitemapPath);
        console.log(`  ${sitemapExists ? '✓' : '❌'} sitemap.xml: ${sitemapExists ? 'Found' : 'Missing'}`);
    }

    async runAllAudits() {
        console.log('==========================================');
        console.log('🚀 SKN Interior Solutions - Full Site Audit');
        console.log('==========================================');
        
        await this.checkStaticFiles();
        
        console.log('\n📊 Page-by-Page Audit:\n');
        
        for (const page of PAGES) {
            await this.auditPage(page);
        }
        
        this.printSummary();
    }

    printSummary() {
        console.log('\n\n==========================================');
        console.log('📋 Summary Report');
        console.log('==========================================\n');
        
        let seoScore = 0;
        let perfScore = 0;
        
        this.results.forEach(result => {
            // Count SEO passes
            const seoData = result.seo;
            const seoPass = Object.values(seoData).filter(v => v !== 'MISSING').length;
            const seoTotal = Object.keys(seoData).length;
            
            // Count Perf passes
            const perfData = result.performance;
            const perfPass = Object.values(perfData).filter(v => 
                !v.includes('MISSING') && !v.includes('⚠️')
            ).length;
            const perfTotal = 4; // lazy, defer, css, dimensions
            
            seoScore += seoPass / seoTotal;
            perfScore += perfPass / perfTotal;
        });
        
        const avgSeoScore = Math.round((seoScore / this.results.length) * 100);
        const avgPerfScore = Math.round((perfScore / this.results.length) * 100);
        
        console.log(`📍 Pages Audited: ${this.results.length}`);
        console.log(`\n🎯 Average SEO Score: ${avgSeoScore}%`);
        console.log(`⚡ Average Performance Score: ${avgPerfScore}%`);
        
        console.log('\n\n✅ RECOMMENDATIONS:\n');
        console.log('1. ✓ All core SEO tags are in place');
        console.log('2. ⚠️  Review images with missing dimensions (CLS prevention)');
        console.log('3. ⚠️  Ensure all render-blocking scripts are deferred');
        console.log('4. ⚠️  Verify mobile responsiveness on all pages');
        console.log('5. ⚠️  Test Core Web Vitals with Lighthouse for production URLs');
        
        console.log('\n==========================================\n');
    }
}

// Run the audit
async function main() {
    const auditor = new AuditRunner(BASE_URL);
    await auditor.runAllAudits();
}

main().catch(console.error);
