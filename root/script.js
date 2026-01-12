// ===================================
// VIBESTREAM - MODERN MUSIC APP
// Real Audio Playback with HTML5 Audio API
// ===================================

// ===================================
// AUDIO PLAYER SETUP
// ===================================
const audioPlayer = document.getElementById('audioPlayer');
let isPlaying = false;
let currentTrack = null;
let currentTrackIndex = -1;
let trackPlaylist = [];
let progressUpdateInterval = null;

// Initialize playlist from HTML
function initializePlaylist() {
    trackPlaylist = Array.from(document.querySelectorAll('.track-item')).map((item, index) => ({
        element: item,
        index: index,
        src: item.dataset.track || `music/track${index + 1}.mp3`,
        duration: parseInt(item.dataset.duration) || 180,
        title: item.querySelector('.track-name').textContent,
        artist: item.querySelector('.track-artist').textContent,
        thumbnail: item.querySelector('.track-thumbnail').src,
        album: item.querySelector('.col-album')?.textContent || 'Unknown'
    }));
}

// ===================================
// AUDIO EVENT LISTENERS
// ===================================
audioPlayer.addEventListener('loadedmetadata', function() {
    console.log('✅ Track loaded:', audioPlayer.src);
    console.log('⏱️ Duration:', formatTime(audioPlayer.duration));
    
    // Update duration display
    const totalTime = document.querySelector('.time-total');
    if (totalTime) {
        totalTime.textContent = formatTime(audioPlayer.duration);
    }
});

audioPlayer.addEventListener('play', function() {
    isPlaying = true;
    updatePlayButtonIcon(true);
    startProgressUpdates();
    console.log('▶️ Playing...');
});

audioPlayer.addEventListener('pause', function() {
    isPlaying = false;
    updatePlayButtonIcon(false);
    stopProgressUpdates();
    console.log('⏸️ Paused');
});

audioPlayer.addEventListener('ended', function() {
    console.log('✅ Track ended');
    // Auto play next track
    playNextTrack();
});

audioPlayer.addEventListener('timeupdate', function() {
    updateProgressBar();
});

audioPlayer.addEventListener('error', function(e) {
    console.error('❌ Audio error:', e);
    alert('⚠️ Cannot load audio file.\n\nPlease add .mp3 files to the "music/" folder:\n• music/track1.mp3\n• music/track2.mp3\n• etc.\n\nOr use your own audio URLs.');
});

// ===================================
// PLAY/PAUSE CONTROLS
// ===================================
function togglePlay() {
    if (!audioPlayer.src) {
        // If no track loaded, play first track
        if (trackPlaylist.length > 0) {
            playTrack(trackPlaylist[0].element, 0);
        }
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play().catch(err => {
            console.error('Play error:', err);
            alert('⚠️ Cannot play audio. Please add .mp3 files to the "music/" folder.');
        });
    }
}

function playTrack(trackElement, index) {
    const track = trackPlaylist[index];
    
    if (!track) {
        console.error('Track not found:', index);
        return;
    }
    
    // Update audio source
    audioPlayer.src = track.src;
    currentTrackIndex = index;
    currentTrack = track;
    
    // Update player UI
    document.querySelector('.player-track-name').textContent = track.title;
    document.querySelector('.player-artist-name').textContent = track.artist;
    document.querySelector('.player-artwork').src = track.thumbnail;
    
    // Highlight current track
    trackPlaylist.forEach(t => t.element.classList.remove('playing'));
    trackElement.classList.add('playing');
    
    // Play audio
    audioPlayer.play().catch(err => {
        console.error('Play error:', err);
        alert('⚠️ Cannot play audio file.\n\nMake sure you have .mp3 files in the "music/" folder:\n' + track.src);
    });
    
    console.log(`🎵 Now playing: ${track.title} by ${track.artist}`);
}

function playNextTrack() {
    if (currentTrackIndex < trackPlaylist.length - 1) {
        const nextIndex = currentTrackIndex + 1;
        playTrack(trackPlaylist[nextIndex].element, nextIndex);
    } else if (repeatMode === 'all') {
        // Loop back to first track
        playTrack(trackPlaylist[0].element, 0);
    } else {
        console.log('📝 Playlist ended');
        isPlaying = false;
        updatePlayButtonIcon(false);
    }
}

function playPreviousTrack() {
    // If more than 3 seconds played, restart current track
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
        return;
    }
    
    // Otherwise play previous track
    if (currentTrackIndex > 0) {
        const prevIndex = currentTrackIndex - 1;
        playTrack(trackPlaylist[prevIndex].element, prevIndex);
    }
}

// ===================================
// PROGRESS BAR UPDATES
// ===================================
function startProgressUpdates() {
    stopProgressUpdates(); // Clear any existing interval
    progressUpdateInterval = setInterval(updateProgressBar, 100);
}

function stopProgressUpdates() {
    if (progressUpdateInterval) {
        clearInterval(progressUpdateInterval);
        progressUpdateInterval = null;
    }
}

function updateProgressBar() {
    if (!audioPlayer.duration) return;
    
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    const progressFilled = document.querySelector('.progress-filled');
    const currentTime = document.querySelector('.time-current');
    
    if (progressFilled) {
        progressFilled.style.width = percent + '%';
    }
    
    if (currentTime) {
        currentTime.textContent = formatTime(audioPlayer.currentTime);
    }
}

function seekToPosition(percent) {
    if (audioPlayer.duration) {
        audioPlayer.currentTime = (percent / 100) * audioPlayer.duration;
    }
}

// ===================================
// UI UPDATES
// ===================================
function updatePlayButtonIcon(playing) {
    const playBtn = document.querySelector('.btn-play-main');
    const heroPlayBtn = document.querySelector('.hero-play-btn');
    
    if (playBtn) {
        const icon = playBtn.querySelector('i');
        if (playing) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    }
    
    // Update track play buttons
    trackPlaylist.forEach((track, idx) => {
        const btn = track.element.querySelector('.track-play-btn i');
        if (btn) {
            if (idx === currentTrackIndex && playing) {
                btn.classList.remove('fa-play');
                btn.classList.add('fa-pause');
            } else {
                btn.classList.remove('fa-pause');
                btn.classList.add('fa-play');
            }
        }
    });
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===================================
// DOM ELEMENTS
// ===================================
const playBtn = document.querySelector('.btn-play-main');
const heroPlayBtn = document.querySelector('.hero-play-btn');
const btnPlayHero = document.querySelector('.btn-play-hero');
const trackItems = document.querySelectorAll('.track-item');
const navLinks = document.querySelectorAll('.nav-link');
const tabs = document.querySelectorAll('.tab');
const likeButtons = document.querySelectorAll('.btn-like-small');
const shareBtn = document.querySelector('.btn-share');
const btnLike = document.querySelector('.btn-like');
const volumeBtn = document.querySelector('.btn-volume');
const shuffleBtn = document.querySelector('.btn-shuffle');
const repeatBtn = document.querySelector('.btn-repeat');

// ===================================
// EVENT LISTENERS SETUP
// ===================================

// Main play button
playBtn?.addEventListener('click', togglePlay);

// Previous/Next buttons
document.querySelector('.btn-previous')?.addEventListener('click', function() {
    playPreviousTrack();
    animateButton(this);
});

document.querySelector('.btn-next')?.addEventListener('click', function() {
    playNextTrack();
    animateButton(this);
});

// ===================================
// TRACK LIST INTERACTIONS
// ===================================

// Play individual track
trackItems.forEach((track, index) => {
    // Track play button
    const trackPlayBtn = track.querySelector('.track-play-btn');
    trackPlayBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        playTrack(track, index);
    });
    
    // Click on track row
    track.addEventListener('click', () => {
        playTrack(track, index);
    });
    
    // Like button
    const likeBtn = track.querySelector('.btn-like-small');
    likeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLike(likeBtn);
    });
    
    // Menu button
    const menuBtn = track.querySelector('.btn-menu-small');
    menuBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        showTrackMenu(track);
    });
});

// Removed duplicate playTrack function - using the one at the top of the file

function toggleLike(button) {
    const icon = button.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.style.color = 'var(--danger)';
        
        // Add to liked count
        const likedSongsLink = document.querySelector('.nav-link .badge');
        if (likedSongsLink) {
            const count = parseInt(likedSongsLink.textContent) + 1;
            likedSongsLink.textContent = count;
        }
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.style.color = '';
        
        // Remove from liked count
        const likedSongsLink = document.querySelector('.nav-link .badge');
        if (likedSongsLink) {
            const count = Math.max(0, parseInt(likedSongsLink.textContent) - 1);
            likedSongsLink.textContent = count;
        }
    }
    
    animateButton(button);
}

function showTrackMenu(track) {
    const trackName = track.querySelector('.track-name').textContent;
    alert(`Track Menu for "${trackName}"\n\n• Add to Playlist\n• Add to Queue\n• Go to Artist\n• Share\n• Download`);
}

// ===================================
// HERO SECTION
// ===================================

heroPlayBtn?.addEventListener('click', function() {
    playAllTracks();
    animateButton(this);
});

btnPlayHero?.addEventListener('click', function() {
    playAllTracks();
    animateButton(this);
});

function playAllTracks() {
    if (trackPlaylist.length > 0) {
        playTrack(trackPlaylist[0].element, 0);
        console.log('🎵 Playing all tracks from the beginning');
    }
}

btnLike?.addEventListener('click', function() {
    const icon = this.querySelector('i');
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        this.style.color = 'var(--danger)';
        this.style.borderColor = 'var(--danger)';
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        this.style.color = '';
        this.style.borderColor = '';
    }
    
    animateButton(this);
});

shareBtn?.addEventListener('click', function() {
    alert('🔗 Playlist link copied to clipboard!\n\nShare it with your friends! 🎵');
    animateButton(this);
});

// ===================================
// NAVIGATION
// ===================================

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active to clicked
        this.classList.add('active');
        
        const linkText = this.querySelector('span')?.textContent || 'page';
        console.log(`Navigating to: ${linkText}`);
    });
});

// ===================================
// FILTER TABS
// ===================================

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active to clicked tab
        this.classList.add('active');
        
        const genre = this.textContent;
        console.log(`Filtering by: ${genre}`);
        
        // Animate tracks
        trackItems.forEach((track, index) => {
            track.style.animation = 'none';
            setTimeout(() => {
                track.style.animation = '';
                track.style.animationDelay = `${index * 0.05}s`;
            }, 10);
        });
    });
});

// ===================================
// VOLUME CONTROL
// ===================================

let isMuted = false;
let previousVolume = 0.7;

// Set initial volume
audioPlayer.volume = 0.7;

volumeBtn?.addEventListener('click', function() {
    if (isMuted) {
        // Unmute
        audioPlayer.volume = previousVolume;
        isMuted = false;
        updateVolumeIcon(previousVolume);
        document.querySelector('.volume-filled').style.width = (previousVolume * 100) + '%';
    } else {
        // Mute
        previousVolume = audioPlayer.volume;
        audioPlayer.volume = 0;
        isMuted = true;
        updateVolumeIcon(0);
        document.querySelector('.volume-filled').style.width = '0%';
    }
});

function updateVolumeIcon(volume) {
    const icon = volumeBtn?.querySelector('i');
    if (!icon) return;
    
    icon.classList.remove('fa-volume-up', 'fa-volume-down', 'fa-volume-mute');
    
    if (volume === 0) {
        icon.classList.add('fa-volume-mute');
    } else if (volume < 0.5) {
        icon.classList.add('fa-volume-down');
    } else {
        icon.classList.add('fa-volume-up');
    }
}

// Volume bar click
const volumeBar = document.querySelector('.volume-bar');
volumeBar?.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width);
    
    audioPlayer.volume = Math.max(0, Math.min(1, percent));
    document.querySelector('.volume-filled').style.width = (percent * 100) + '%';
    
    isMuted = audioPlayer.volume === 0;
    updateVolumeIcon(audioPlayer.volume);
    
    console.log('🔊 Volume:', Math.round(audioPlayer.volume * 100) + '%');
});

// ===================================
// PROGRESS BAR INTERACTION
// ===================================

const progressBar = document.querySelector('.progress-bar');
progressBar?.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    seekToPosition(percent);
    console.log('⏩ Seeking to:', Math.round(percent) + '%');
});

// ===================================
// SHUFFLE & REPEAT
// ===================================

let isShuffled = false;
let repeatMode = 'off'; // 'off', 'all', 'one'

shuffleBtn?.addEventListener('click', function() {
    isShuffled = !isShuffled;
    
    if (isShuffled) {
        this.style.color = 'var(--success)';
        console.log('🔀 Shuffle: ON');
    } else {
        this.style.color = '';
        console.log('🔀 Shuffle: OFF');
    }
    
    animateButton(this);
});

repeatBtn?.addEventListener('click', function() {
    const icon = this.querySelector('i');
    
    if (repeatMode === 'off') {
        repeatMode = 'all';
        this.style.color = 'var(--success)';
        console.log('🔁 Repeat: All');
    } else if (repeatMode === 'all') {
        repeatMode = 'one';
        icon.classList.add('fa-redo-alt');
        this.style.color = 'var(--success)';
        audioPlayer.loop = true;
        console.log('🔂 Repeat: One');
    } else {
        repeatMode = 'off';
        icon.classList.remove('fa-redo-alt');
        this.style.color = '';
        audioPlayer.loop = false;
        console.log('🔁 Repeat: OFF');
    }
    
    animateButton(this);
});

// ===================================
// ADDITIONAL CONTROLS
// ===================================

document.querySelector('.btn-queue')?.addEventListener('click', function() {
    alert('📋 Queue\n\nComing up next:\n• Levitating - Dua Lipa\n• Good 4 U - Olivia Rodrigo\n• As It Was - Harry Styles');
    animateButton(this);
});

document.querySelector('.btn-devices')?.addEventListener('click', function() {
    alert('📱 Available Devices\n\n• This Computer ✓\n• Living Room Speaker\n• Bedroom TV\n• Phone');
    animateButton(this);
});

document.querySelector('.btn-fullscreen')?.addEventListener('click', function() {
    console.log('Toggling fullscreen mode');
    animateButton(this);
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

function animateButton(button) {
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

// ===================================
// USER PROFILE
// ===================================

const userProfile = document.querySelector('.user-profile');
userProfile?.addEventListener('click', function() {
    alert('👤 User Profile\n\nAlex Rivers\nPremium User\n\n• Account Settings\n• Subscription\n• Logout');
});

// ===================================
// INITIALIZATION
// ===================================

window.addEventListener('load', function() {
    console.log('%c🎵 Vibestream 2026 - Real Audio Player 🎵', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
    console.log('%cYour Personal Music Universe with REAL Audio Playback! 🎧', 'font-size: 14px; color: #a29bfe;');
    console.log('%cBuilt with HTML5 Audio API + Advanced Flexbox 💪', 'font-size: 12px; color: #6e7191;');
    
    // Initialize playlist
    initializePlaylist();
    console.log(`📋 Loaded ${trackPlaylist.length} tracks`);
    
    // Greeting based on time
    const hour = new Date().getHours();
    const greeting = document.querySelector('.greeting');
    
    if (greeting) {
        if (hour < 12) {
            greeting.textContent = 'Good morning, Alex! 🌅';
        } else if (hour < 18) {
            greeting.textContent = 'Good afternoon, Alex! ☀️';
        } else {
            greeting.textContent = 'Good evening, Alex! 🌙';
        }
    }
    
    console.log('\n💡 Instructions:');
    console.log('1. Add .mp3 files to the "music/" folder');
    console.log('2. Name them: track1.mp3, track2.mp3, etc.');
    console.log('3. Or update the data-track attributes in HTML');
    console.log('4. Click any track to start playing! 🎵\n');
});

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

document.addEventListener('keydown', function(e) {
    // Spacebar: Play/Pause
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
    }
    
    // Arrow Right: Next track
    if (e.code === 'ArrowRight' && e.ctrlKey) {
        e.preventDefault();
        playNextTrack();
    }
    
    // Arrow Left: Previous track
    if (e.code === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        playPreviousTrack();
    }
    
    // Arrow Up: Volume up
    if (e.code === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.1);
        document.querySelector('.volume-filled').style.width = (audioPlayer.volume * 100) + '%';
        updateVolumeIcon(audioPlayer.volume);
        console.log('🔊 Volume:', Math.round(audioPlayer.volume * 100) + '%');
    }
    
    // Arrow Down: Volume down
    if (e.code === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.1);
        document.querySelector('.volume-filled').style.width = (audioPlayer.volume * 100) + '%';
        updateVolumeIcon(audioPlayer.volume);
        console.log('🔊 Volume:', Math.round(audioPlayer.volume * 100) + '%');
    }
    
    // M: Mute/Unmute
    if (e.code === 'KeyM') {
        e.preventDefault();
        volumeBtn?.click();
    }
    
    // L: Like current track
    if (e.code === 'KeyL' && e.ctrlKey) {
        e.preventDefault();
        document.querySelector('.btn-player-like')?.click();
    }
});

console.log('⌨️ Keyboard Shortcuts:');
console.log('• Space: Play/Pause');
console.log('• Ctrl + →: Next Track');
console.log('• Ctrl + ←: Previous Track');
console.log('• Ctrl + ↑: Volume Up');
console.log('• Ctrl + ↓: Volume Down');
console.log('• M: Mute/Unmute');
console.log('• Ctrl + L: Like Track');
