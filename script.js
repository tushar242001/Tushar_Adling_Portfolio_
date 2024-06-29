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

document.querySelectorAll(".elem").forEach(function(elem){
    var rotate=0;
    var diffro=0;

    elem.addEventListener("mouseleave",function(details){
        var diffen=details.clientY-elem.getBoundingClientRect().top;
        diffro=details.clientX-rotate;
        rotate=details.clientX;
  
        gsap.to(elem.querySelector("img"),{
            opacity:0,
            ease: Power3,
           
        })
    });



    elem.addEventListener("mousemove",function(details){

      
        var diffen=details.clientY-elem.getBoundingClientRect();
        diffro=details.clientX-rotate;
        rotate=details.clientX;
  
        gsap.to(elem.querySelector("img"),{
            opacity:1,
            ease: Power1,
            top: diffen,
            left: details.clientX,
            rotate:gsap.utils.clamp(-10,20,diffro)
         })
    });

});


circlemousefollower();
firstpageAnim();
circlechaptkaro();








