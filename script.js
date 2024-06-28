const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
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
circlemousefollower();
firstpageAnim();
circlechaptkaro();