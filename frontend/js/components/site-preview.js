/**
 * SitePreview - Vanilla JavaScript Component
 * Handles website preview in iframe with navigation and error handling
 * Size: ~300 lines (well under 500-line limit)
 */

class SitePreview {
    constructor(containerId) {
        this.containerId = containerId;
        this.previewFrame = null;
        this.originalHtml = '';
        this.isInitialized = false;
        
        // Bind methods to preserve 'this' context
        this.handleIframeError = this.handleIframeError.bind(this);
        this.updatePreview = this.updatePreview.bind(this);
        this.downloadWebsite = this.downloadWebsite.bind(this);
    }

    init() {
        if (this.isInitialized) {
            console.log('SitePreview already initialized, skipping...');
            return;
        }
        
        this.createPreviewInterface();
        this.attachEventListeners();
        this.setupIframeMonitoring();
        this.isInitialized = true;
        console.log('SitePreview component initialized');
    }

    createPreviewInterface() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with id '${this.containerId}' not found`);
            return;
        }

        container.innerHTML = `
            <div class="preview-header">
                <h2 class="preview-title">Live Website Preview</h2>
                <div>
                    <button class="action-button" id="downloadButton">Download</button>
                    <a href="/dashboard#resources" target="_blank" style="margin-left: 12px; color: #2563eb; text-decoration: none; font-size: 14px; font-weight: 500;">Resources</a>
                </div>
            </div>

            <div class="preview-frame">
                <iframe 
                    id="previewFrame" 
                    class="preview-content"
                    srcdoc="<div style='display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial; color: #64748b; text-align: center;'><div><h2>Website Preview</h2><p>Your generated website will appear here</p><p>Choose a business type or describe your service to get started!</p></div></div>"
                    sandbox="allow-scripts allow-forms"
                    loading="lazy"
                ></iframe>
            </div>
        `;

        this.previewFrame = document.getElementById('previewFrame');
    }

    attachEventListeners() {
        const downloadButton = document.getElementById('downloadButton');
        if (downloadButton) {
            downloadButton.addEventListener('click', this.downloadWebsite);
        }

        if (this.previewFrame) {
            this.previewFrame.addEventListener('error', this.handleIframeError);
        }
    }

    setupIframeMonitoring() {
        if (!this.previewFrame) return;

        this.previewFrame.addEventListener('load', () => {
            console.log('Preview iframe loaded successfully');
            try {
                // Check if iframe content is accessible
                const iframeDoc = this.previewFrame.contentDocument || this.previewFrame.contentWindow.document;
                if (iframeDoc) {
                    console.log('Iframe content accessible');
                    
                    // Listen for errors within the iframe
                    this.previewFrame.contentWindow.addEventListener('error', (e) => {
                        console.error('Iframe content error:', e.error);
                        if (e.error.message.includes('generateFromPure')) {
                            console.log('Detected generateFromPure error - this is a known issue being handled');
                        }
                    });
                }
            } catch (e) {
                console.log('Iframe cross-origin restriction (normal):', e.message);
            }
        });
    }

    handleIframeError(iframe) {
        console.error('Iframe loading error detected');
        const errorFrame = iframe || this.previewFrame;
        
        if (errorFrame) {
            errorFrame.srcdoc = `
                <div style='display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial; color: #ef4444; text-align: center;'>
                    <div>
                        <h3>Preview Error</h3>
                        <p>There was an issue loading the website preview.</p>
                        <p style="font-size: 14px; color: #6b7280;">Try generating the website again or check the browser console for details.</p>
                    </div>
                </div>
            `;
        }
    }

    updatePreview(html) {
        if (!html || typeof html !== 'string') {
            console.log('Invalid HTML provided for preview update');
            return;
        }

        console.log('Updating preview with new HTML');
        
        // Store original HTML for downloading
        this.originalHtml = html;
        
        // Sanitize and display in iframe
        const sanitizedHtml = this.sanitizeHtmlForPreview(html);
        if (this.previewFrame) {
            this.previewFrame.srcdoc = sanitizedHtml;
        }
    }

    sanitizeHtmlForPreview(html) {
        if (!html || typeof html !== 'string') {
            console.log('Invalid HTML input for sanitization');
            return html || '';
        }
        
        console.log('Sanitizing HTML for preview...');
        
        try {
            // Basic validation - ensure we have a complete HTML structure
            if (!html.includes('<html') && !html.includes('<body')) {
                console.log('HTML appears incomplete, wrapping in basic structure');
                html = '<!DOCTYPE html><html><head><title>Preview</title></head><body>' + html + '</body></html>';
            }
            
            // Fix common navigation issues in iframe
            let sanitized = html
                // Convert absolute links to hash anchors for single-page navigation
                .replace(/href="\//g, 'href="#')
                .replace(/href="\.\/"/g, 'href="#"')
                // Fix links that might try to navigate parent window
                .replace(/target="_parent"/g, 'target="_self"')
                .replace(/target="_top"/g, 'target="_self"')
                // Remove any potentially problematic script references
                .replace(/onclick\s*=\s*["'][^"']*generateFromPure[^"']*["']/gi, 'onclick="return false;"')
                // Clean up any malformed script tags
                .replace(/<script[^>]*>\s*<\/script>/gi, '')
                // Add base tag and smooth scroll CSS for better navigation
                .replace(/<head>/i, '<head><base target="_self"><style>html{scroll-behavior:smooth;}</style>');
                
            // Add JavaScript to handle anchor link navigation within iframe
            const navigationScript = this.createNavigationScript();
            
            // Insert the navigation script before closing body tag, with fallback
            if (sanitized.includes('</body>')) {
                sanitized = sanitized.replace(/<\/body>/i, navigationScript + '</body>');
            } else if (sanitized.includes('</html>')) {
                sanitized = sanitized.replace(/<\/html>/i, navigationScript + '</html>');
            } else {
                // If no proper closing tags, append to end
                sanitized += navigationScript;
            }
                
            console.log('HTML sanitized for iframe display with navigation fixes');
            return sanitized;
            
        } catch (error) {
            console.error('Error sanitizing HTML:', error);
            // Return original HTML if sanitization fails
            return html;
        }
    }

    createNavigationScript() {
        return `<script>
            (function() {
                document.addEventListener("DOMContentLoaded", function() {
                    try {
                        document.querySelectorAll("a[href^='#']").forEach(function(link) {
                            link.addEventListener("click", function(e) {
                                e.preventDefault();
                                var targetId = this.getAttribute("href").substring(1);
                                var targetElement = document.getElementById(targetId);
                                if (targetElement) {
                                    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
                                }
                            });
                        });
                    } catch (err) {
                        console.log("Navigation setup error:", err);
                    }
                });
            })();
        </script>`;
    }

    downloadWebsite() {
        if (!this.originalHtml) {
            alert('No website to download. Please generate a website first.');
            return;
        }

        try {
            // Create download blob
            const blob = new Blob([this.originalHtml], { type: 'text/html' });
            const url = window.URL.createObjectURL(blob);
            
            // Create download link
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'website.html';
            downloadLink.style.display = 'none';
            
            // Trigger download
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Clean up URL
            window.URL.revokeObjectURL(url);
            
            console.log('Website download initiated');
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download website. Please try again.');
        }
    }

    showEmptyState() {
        if (this.previewFrame) {
            this.previewFrame.srcdoc = `
                <div style='display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial; color: #64748b; text-align: center;'>
                    <div>
                        <h2>Website Preview</h2>
                        <p>Your generated website will appear here</p>
                        <p>Fill out the business information form to get started!</p>
                    </div>
                </div>
            `;
        }
    }

    showLoadingState() {
        if (this.previewFrame) {
            this.previewFrame.srcdoc = `
                <div style='display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial; color: #2563eb; text-align: center;'>
                    <div>
                        <div style="width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
                        <h3>Generating Your Website...</h3>
                        <p>Please wait while we create your professional website</p>
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
        }
    }

    reset() {
        this.originalHtml = '';
        this.showEmptyState();
    }

    getOriginalHtml() {
        return this.originalHtml;
    }
}

// Export for global use
window.SitePreview = SitePreview;