/**
 * Automatically transforms common cloud storage links (Google Drive, Dropbox) 
 * into direct image URLs that can be used in <img> tags.
 */
export function getDirectImageUrl(url: string | null | undefined): string {
    if (!url) return '';
    
    try {
        // Normalize URL - remove whitespace
        const cleanUrl = url.trim();

        // Handle Google Drive links
        // Matches:
        // - drive.google.com/file/d/[ID]/view...
        // - drive.google.com/open?id=[ID]
        // - drive.google.com/uc?id=[ID]
        // - drive.google.com/thumbnail?id=[ID]
        // - docs.google.com/file/d/[ID]
        const driveMatch = cleanUrl.match(/(?:id=|\/d\/|uc\?id=)([a-zA-Z0-9_-]+)/);
        
        if (driveMatch && driveMatch[1] && (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com'))) {
            // Using Thumbnail API for maximum compatibility
            return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1000`;
        }
        
        // Handle Dropbox links by forcing raw content
        if (cleanUrl.includes('dropbox.com')) {
            return cleanUrl.replace('dl=0', 'raw=1').replace('www.dropbox.com', 'dl.dropboxusercontent.com');
        }

        // Handle Unsplash photo page links
        // Example: https://unsplash.com/photos/gym-equipment-inside-room-20jX9b35r_M
        if (cleanUrl.includes('unsplash.com/photos/')) {
            // Extract the ID which is the last segment of the path (even if it contains dashes)
            const urlParts = cleanUrl.split('?')[0].split('/').filter(Boolean);
            const photoId = urlParts[urlParts.length - 1];
            
            if (photoId) {
                // The /download?force=true endpoint is a reliable redirect to the actual image
                return `https://unsplash.com/photos/${photoId}/download?force=true`;
            }
        }
        
        // Handle standard URLs
        return cleanUrl;
    } catch (e) {
        return url || '';
    }
}
