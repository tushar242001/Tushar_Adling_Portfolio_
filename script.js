const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});

// Make navbar anchor clicks use LocomotiveScroll's scrolling so the page
// doesn't get 'stuck' at a section. This prevents the browser's native
// anchor jump (which can conflict with the scroller) and lets locomotive
// handle smooth scrolling while preserving normal scroll behavior afterwards.
document.querySelectorAll('#navbar a[href^="#"]').forEach(function(link){
    link.addEventListener('click', function(ev){
        var href = link.getAttribute('href');
        if(!href || href === '#') return; // allow placeholders
        var target = document.querySelector(href);
        if(!target) return;
        ev.preventDefault();
        // scroll is the LocomotiveScroll instance declared above
        try{
            scroll.scrollTo(target);
        }catch(err){
            // Fallback: if locomotive isn't available for some reason, use native
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

function firstpageAnim()
{
    var tl = gsap.timeline();

    tl.from("#nav",{
        y : '-10',
        opacity : 0 ,
        duration: 1.7,
        ease: Expo.easeInOut
    })
    .to(".boundingelem",{
        y : '0',
        duration: 1.5,
        stagger: .2,
        ease: Expo.easeInOut,
        delay: -1
       
    })
    .from("#herofooter",{
        y : '-10',
        opacity : 0 ,
        duration: 1.5,
        delay: -1,
        ease: Expo.easeInOut
    })

}

function circlechaptkaro()
{
    // Define default scale value
    var xscale=1;
    var yscale=1;
    var xprev=0;
    var yprev=0;

    window.addEventListener("mousemove",function(dets)
    {
        xscale=gsap.utils.clamp(.8,1.2,dets.clientX-xprev);
        yscale=gsap.utils.clamp(.8,1.2,dets.clientY-yprev); 
        xprev=dets.clientX;
        yprev=dets.clientY;
        circlemousefollower(xscale,yscale);

    });
}

function circlemousefollower(xscale,yscale)
{
    window.addEventListener("mousemove",function(dets){
        document.querySelector("#minicircle").style.transform = `translate(${dets.clientX}px,${dets.clientY}px) scale(${xscale},${yscale})`;
    });

}

document.querySelectorAll(".elem").forEach(function(elem){
    var rotate = 0;
    var diffro = 0;
    var img = elem.querySelector("img");

    // When the pointer enters an element, hide other preview images and show this one
    elem.addEventListener("mouseenter", function(e){
        // hide other images to ensure only this element's image is visible
        document.querySelectorAll('.elem img').forEach(function(other){
            if(other !== img){
                gsap.to(other, { opacity: 0, ease: Power3 });
            }
        });
        gsap.to(img, { opacity: 1, ease: Power3 });
    });

    elem.addEventListener("mouseleave", function(e){
        diffro = e.clientX - rotate;
        rotate = e.clientX;
        gsap.to(img, {
            opacity: 0,
            ease: Power3,
        });
    });

    elem.addEventListener("mousemove", function(e){
        // Get mouse position relative to the element
        var rect = elem.getBoundingClientRect();
        var localX = e.clientX - rect.left;
        var localY = e.clientY - rect.top;

        diffro = e.clientX - rotate;
        rotate = e.clientX;

        // Determine image size (offsetWidth/Height are available after layout)
        var imgWidth = img.offsetWidth || img.clientWidth || img.naturalWidth || 0;
        var imgHeight = img.offsetHeight || img.clientHeight || img.naturalHeight || 0;

        // Position image so its center aligns with the pointer
        var left = localX - imgWidth / 2;
        var top = localY - imgHeight / 2;

        gsap.to(img, {
            opacity: 1,
            ease: Power1,
            top: top + "px",
            left: left + "px",
            rotate: gsap.utils.clamp(-20, 20, diffro)
        });
    });

});


circlemousefollower();
firstpageAnim();
circlechaptkaro();

// Slide-in animation for project cards using IntersectionObserver
(function(){
    var cards = document.querySelectorAll('#project .project1');
    if(!('IntersectionObserver' in window) || cards.length === 0) {
        // fallback: just make them visible
        cards.forEach(function(c){ c.classList.add('in-view'); });
        return;
    }

    var io = new IntersectionObserver(function(entries, observer){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    },{ root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    cards.forEach(function(card, i){
        // stagger: delay adding observer slightly for nicer serial entrance
        setTimeout(function(){ io.observe(card); }, i * 120);
    });
})();

// Create a simple slideshow from the existing .project1 cards
(function(){
    var project = document.querySelector('#project');
    if(!project) return;
    var cards = Array.from(project.querySelectorAll('.project1'));
    if(cards.length <= 1) return; // no slideshow needed

    // Build slider markup
    var slider = document.createElement('div'); slider.className = 'slider';
    var track = document.createElement('div'); track.className = 'slider-track';

    // Move cards into track
    cards.forEach(function(c){ track.appendChild(c); });
    slider.appendChild(track);

    // Insert slider after the H1 inside #project
    var h1 = project.querySelector('h1');
    if(h1 && h1.nextSibling) project.insertBefore(slider, h1.nextSibling);
    else project.appendChild(slider);

    // navigation
    var nav = document.createElement('div'); nav.className = 'slider-nav';
    var prev = document.createElement('button'); prev.className='prev'; prev.innerHTML='‹';
    var next = document.createElement('button'); next.className='next'; next.innerHTML='›';
    nav.appendChild(prev); nav.appendChild(next);
    slider.appendChild(nav);

    // dots
    var dotsWrap = document.createElement('div'); dotsWrap.className = 'slider-dots';
    var dots = [];
    for(var i=0;i<cards.length;i++){
        var d = document.createElement('button'); d.className='slider-dot'; d.setAttribute('data-index', i);
        dotsWrap.appendChild(d); dots.push(d);
    }
    slider.appendChild(dotsWrap);

    // state
    var idx = 0;
    var autoplay = true;
    var interval = 4000;
    var timer = null;

    function update(){
        track.style.transform = 'translateX(-'+(idx*100)+'%)';
        dots.forEach(function(dd, i){ dd.classList.toggle('active', i===idx); });
        // update locomotive scroller if present (layout changed)
        try{ scroll.update(); }catch(e){}
    }

    function start(){ if(timer) clearInterval(timer); if(!autoplay) return; timer = setInterval(function(){ idx = (idx+1) % cards.length; update(); }, interval); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }

    prev.addEventListener('click', function(){ idx = (idx-1+cards.length)%cards.length; update(); stop(); });
    next.addEventListener('click', function(){ idx = (idx+1)%cards.length; update(); stop(); });
    dots.forEach(function(d){ d.addEventListener('click', function(){ idx = Number(d.getAttribute('data-index')); update(); stop(); }); });

    slider.addEventListener('mouseenter', function(){ autoplay=false; stop(); });
    slider.addEventListener('mouseleave', function(){ autoplay=true; start(); });

    // initial layout: ensure track width matches slides - CSS uses flex so ok
    update(); start();

    // expose for debug
    project._slider = { slider: slider, track: track, dots: dots };
})();








