import husl from 'husl';
import d3 from 'd3-color';
import chroma from 'chroma-js';

const hueClip = h => Math.min(360, Math.max(0, h));
const saturationClip = s => Math.min(100, Math.max(0, s));
const lightnessClip = l => Math.min(100, Math.max(0, l));

const hsvToHslWrapper = func => {
  return (h, s, v) => {
    // return func(h, s, v);
    // const color = chroma.hsv(h, s / 100, v / 100).hsl();
    const color = hsv2hsl(h, s, v);
    return func.call(null, color[0], color[1], color[2]);
  }
};
function convertHslProxyToHsvProxy (proxy) {
  proxy.toRGB = hsvToHslWrapper(proxy.toRGB);
  proxy.toHex = hsvToHslWrapper(proxy.toHex);
  return proxy;
}

const hclFunc = {
  resolution: 150,
  referenceSaturation: 33.9,
  toRGB (hue, saturation, lightness) {
    const color = d3.hcl(hue, saturation, lightness);
    if (!color.displayable()) return [0, 0, 0];
    const {r, g, b} = color.rgb();
    return [r / 255, g / 255, b / 255];
  },
  toHex (hue, saturation, lightness) {
    const color = d3.hcl(hue, saturation, lightness);
    if (!color.displayable()) return '#000';
    return color.toString();
  },
  fromHex (hex) {
    const color = d3.hcl(hex);
    return {
      hue: color.h,
      saturation: color.c,
      lightness: color.l
    };
  }
};
const hclExtendedFunc = {
  resolution: 150,
  referenceSaturation: 100,
  toRGB (hue, saturation, lightness) {
    const color = d3.hcl(hue, saturation, lightness);
    const {r, g, b} = color.rgb();
    return [r / 255, g / 255, b / 255];
  },
  toHex (hue, saturation, lightness) {
    const color = d3.hcl(hue, saturation, lightness);
    return color.toString();
  },
  fromHex (hex) {
    const color = d3.hcl(hex);
    return {
      hue: color.h,
      saturation: color.c,
      lightness: color.l
    };
  }
};
const huslFunc = {
  resolution: 40,
  referenceSaturation: 100,
  // toRGB: husl.toRGB,
  // prevent from going over 1
  toRGB: husl.toRGB,
  toHex: (h, s, l) => husl.toHex.apply(null, [
    hueClip(h),
    saturationClip(s),
    lightnessClip(l)
  ]),
  fromHex: husl.fromHex
};
const huslpFunc = {
  resolution: 40,
  referenceSaturation: 100,
  toRGB: husl.p.toRGB,
  toHex: (h, s, l) => husl.p.toHex.apply(null, [
    hueClip(h),
    saturationClip(s),
    lightnessClip(l)
  ]),
  fromHex: husl.p.fromHex
};
const hslFunc = {
  resolution: 100,
  referenceSaturation: 100,
  toRGB (hue, saturation, lightness) {
    const color = d3.hsl(hue, saturation / 100, lightness / 100);
    // if (!color.displayable()) return [0, 0, 0];
    const {r, g, b} = color.rgb();
    return [r / 255, g / 255, b / 255];
  },
  toHex (hue, saturation, lightness) {
    const color = d3.hsl(hue, saturation / 100, lightness / 100);
    // if (!color.displayable()) return '#000';
    return color.toString();
  },
  fromHex (hex) {
    const color = d3.hsl(hex);
    return {
      hue: color.h,
      saturation: color.s * 100,
      lightness: color.l * 100
    };
  }
};
const hsvFunc = {
  resolution: 20,
  referenceSaturation: 100,
  toRGB (hue, saturation, lightness) {
    return chroma.hsv(hue, saturation / 100, lightness / 100).rgb().map(i => i / 255);
  },
  toHex (hue, saturation, lightness) {
    return chroma.hsv(hue, saturation / 100, lightness / 100).hex();
  },
  fromHex (hex) {
    const color = chroma(hex).hsv();
    return {
      hue: color[0],
      saturation: color[1] * 100,
      lightness: color[2] * 100
    };
  }
};




// https://gist.github.com/electricg/4435259
// Which HTML element is the target of the event
function mouseTarget(e) {
	var targ;
	if (!e) var e = window.event;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
	return targ;
}

// Mouse position relative to the document
// From http://www.quirksmode.org/js/events_properties.html
function mousePositionDocument(e) {
	var posx = 0;
	var posy = 0;
	if (!e) {
		var e = window.event;
	}
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	return {
		x : posx,
		y : posy
	};
}

// Find out where an element is on the page
// From http://www.quirksmode.org/js/findpos.html
function findPos(obj) {
	var curleft = 0;
  var curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return {
		left : curleft,
		top : curtop
	};
}

// Mouse position relative to the element
// not working on IE7 and below
function mousePositionElement(e) {
	var mousePosDoc = mousePositionDocument(e);
	var target = mouseTarget(e);
	var targetPos = findPos(target);
	var posx = mousePosDoc.x - targetPos.left;
	var posy = mousePosDoc.y - targetPos.top;
	return {
		x : posx,
		y : posy
	};
}

// https://gist.github.com/xpansive/1337890
function hsl2hsv (h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  s *= (l < 0.5) ? l : 1 - l;
  return [ // [hue, saturation, value
    h * 360, // Hue stays the same
    (2 * s / (l + s)) * 100, // Saturation
    (l + s) * 100 // Value
  ]
}
function hsv2hsl (hue,sat,val) {
  hue /= 360;
  sat /= 100;
  val /= 100;
  return [ //[hue, saturation, lightness]
          //Range should be between 0 - 1
      hue * 360, //Hue stays the same

      //Saturation is very different between the two color spaces
      //If (2-sat)*val < 1 set it to sat*val/((2-sat)*val)
      //Otherwise sat*val/(2-(2-sat)*val)
      //Conditional is not operating with hue, it is reassigned!
      sat * val / ((hue = (2 - sat) * val) < 1 ? hue : 2 - hue) * 100,

      (hue / 2) * 100 //Lightness is (2-sat)*val/2
      //See reassignment of hue above
  ]
}


export {
  huslFunc,
  huslpFunc,
  hsvFunc,
  hslFunc,
  hclFunc,
  hclExtendedFunc,

  hueClip,
  saturationClip,
  lightnessClip,
  mousePositionElement
};
