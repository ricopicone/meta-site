
function hide_class(aclass) {
	var to_hide = document.getElementsByClassName(aclass); // array
	for(var i = 0; i < to_hide.length; i++){
		to_hide[i].classList.add("hide");
	}
}

function unhide_class(aclass) {
	var to_hide = document.getElementsByClassName(aclass); // array
	for(var i = 0; i < to_hide.length; i++){
		to_hide[i].classList.remove("hide");
	}
}

function hide_all() {
	var to_hide = document.querySelectorAll("section.ts:not(.hide),section.ds:not(.hide)")
	for(var i = 0; i < to_hide.length; i++){
		to_hide[i].classList.add("hide");
	}
}

let params = new URLSearchParams(window.location.search)

function get_v_urlparams() {
	return {ts:params.get("TS"),ds:params.get("DS")};
}

function set_v_ts_menu(ts) {
	const menu = document.getElementById("tsmenu");
	menu.innerHTML = ts+"▾";
	document.querySelectorAll(".dropdown.tsd a").forEach(function(element) {
	    if (element.id == 'mi'+ts) {
	    	element.style.fontWeight = 'bold';
	    } else {
		    element.style.fontWeight = 'normal';
		}
	});
}

function set_v_ds_menu(ds) {
	const menu = document.getElementById("dsmenu");
	menu.innerHTML = ds+"▾";
	document.querySelectorAll(".dropdown.dsd a").forEach(function(element) {
	    if (element.id == 'mi'+ds) {
	    	element.style.fontWeight = 'bold';
	    } else {
		    element.style.fontWeight = 'normal';
		}
	});
}

function set_v_ts_tags(ts) {
	document.querySelectorAll(".ts-tag").forEach(function(element) {
    	element.innerHTML = ts;
    });
}

function set_v_ds_tags(ds) {
	document.querySelectorAll(".ds-tag").forEach(function(element) {
    	element.innerHTML = ds;
    });
}

function set_v_ts(ts) {
	ts_old = params.get("TS")
	if (ts == ts_old) {
		params.set("TS","");
		set_v_ts_menu('TX');
		set_v_ts_tags('TX');
		v_filter_page({ts:null,ds:params.get('DS')});
	} else {
		params.set("TS",ts);
		set_v_ts_menu(ts);
		set_v_ts_tags(ts);
		v_filter_page({ts:ts,ds:null});
	}
	history.replaceState(null, null, "?" + params.toString());
}

function set_v_ds(ds) {
	ds_old = params.get("DS")
	if (ds == ds_old) {
		params.set("DS","");
		set_v_ds_menu('DX');
		set_v_ds_tags('DX');
		v_filter_page({ts:params.get('TS'),ds:null});
	} else {
		params.set("DS",ds);
		set_v_ds_menu(ds);
		set_v_ds_tags(ds);
		v_filter_page({ts:null,ds:ds});
	}
	history.replaceState(null, null, "?" + params.toString());
}

function set_v_urlparams(v_dict) {
	if (v_dict.ts !== null) {
		params.set("TS",v_dict.ts);
	}
	if (v_dict.ds !== null) {
		params.set("DS",v_dict.ds);
	}
	history.replaceState(null, null, "?" + params.toString());
	v_filter_page(v_dict);
}

let v_default = {ts:"T1",ds:null};
let v_urlparams = get_v_urlparams();
v_filter_page(v_urlparams);
span_populate(v_urlparams);

function v_filter_page(v_dict) {
	ts = v_dict.ts;
	if (ts) {
		tsp = ts.replace(/\./g,"-"); // use for classes
	} else {
		tsp = null;
	}
	ds = v_dict.ds;
	if (ds) {
		dsp = ds.replace(/\./g,"-"); // use for classes
	} else {
		dsp = null;
	}
	if (!ts && !ds) {
		console.log('setting to default:',v_default);
		set_v_urlparams(v_default);
		set_v_ts_menu(v_default.ts);
		set_v_ts_tags(v_default.ts);
		return
	}
	hide_all();
	if (ts && !ds) {
		set_v_ts_menu(ts);
		set_v_ts_tags(ts);
		document.querySelectorAll("section.ts."+tsp).forEach(function(element) {
		    element.classList.remove("hide");
		});
		document.querySelectorAll("section:not(.ts)").forEach(function(element) {
		    element.classList.remove("hide");
		});
	} else if (!ts && ds) {
		set_v_ds_menu(ds);
		set_v_ds_tags(ds);
		document.querySelectorAll("section.ds."+dsp).forEach(function(element) {
		    element.classList.remove("hide");
		});
		document.querySelectorAll("section:not(.ds)").forEach(function(element) {
		    element.classList.remove("hide");
		});
	} else {
		set_v_ts_menu(ts);
		set_v_ds_menu(ds);
		set_v_ts_tags(ts);
		set_v_ds_tags(ds);
		// TODO test for compatibility of requested versions
		document.querySelectorAll("section.ds."+dsp+",section.ts."+tsp).forEach(function(element) {
		    element.classList.remove("hide");
		});
	}
}

// Remove section numbers from Summary Sections (i.e., h1 elements that have the content "Summary")
//     These were inserted via the CSS ::before pseudo element from data attribute data-0-sec
//     This is a hack to remove them and remove the space it leaves behind
document.querySelectorAll("h1").forEach(function(element) {
	if (element.textContent == "Summary") {
		element.removeAttribute("data-0-sec");
	}
});

// populate TS and DS spans
function span_populate(v_urlparams) {
	document.querySelectorAll("span.ts").forEach(function(element) {
	    element.textContent = v_urlparams.ts;
	});
	if (!v_urlparams.ds) {
		v_urlparams.ds = "DY"
	}
	document.querySelectorAll("span.ds").forEach(function(element) {
	    element.textContent = v_urlparams.ds;
	});
}

// Expand/collapse video
function toggle_video_visibility(dis) { // onclick revelation
	var button_div = dis;
	var video_container_div = button_div.parentElement;
	var iframes = video_container_div.getElementsByTagName('iframe');
	if (iframes.length > 0) { // already has iframe
		for (let iframe of iframes) {
			if (iframe.classList.contains('hiddeniframe')) {
				video_container_div.classList.remove('hiddenvideo-container')
				iframe.classList.remove('hiddeniframe')
			} else {
				video_container_div.classList.add('hiddenvideo-container')
				iframe.classList.add('hiddeniframe')
				button_div.value = "video"
			}
		}
	} else { // no iframe -- create them!
		for (var i = 0; i < video_container_div.dataset.embedcount; i++) {
			var iframe = document.createElement( "iframe" );
			iframe.setAttribute( "frameborder", "0" );
			iframe.setAttribute( "allowfullscreen", "" );
			iframe.setAttribute( "allow", "encrypted-media")
			video_container_div.appendChild(iframe);
		}
		iframes = video_container_div.getElementsByTagName('iframe'); // Now it has iframes
		var i = 1;
		for (let iframe of iframes) {
			var index_value = eval("video_container_div.dataset.embedindex"+i)
			iframe.setAttribute( "src", "https://www.youtube-nocookie.com/embed?listType=playlist&list=PL"+ video_container_div.dataset.embedplaylist +"&index=" + index_value );
			// iframe.classList.remove('hiddeniframe')
			i++;
		}
        video_container_div.classList.remove('hiddenvideo-container')
	}
}

// Hide video-container div if no video or if header has class 'faux'
document.querySelectorAll("div.video-container").forEach(function(element) {
	previous_header_element = element.previousElementSibling;
	if (!previous_header_element.classList.contains('real-section') || previous_header_element.classList.contains('faux')) {
		element.style.display = 'none';
	}
});

// Add fixed next and previous buttons to the bottom of the page in a div container
var next_prev_buttons = document.createElement("div");
next_prev_buttons.classList.add("next-prev-buttons");
document.body.appendChild(next_prev_buttons);

var next_button = document.createElement("a");
next_button.innerHTML = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" viewBox="0 0 122.88 122.88" style="enable-background:new 0 0 122.88 122.88" xml:space="preserve"><g><path d="M37.95,4.66C45.19,1.66,53.13,0,61.44,0c16.96,0,32.33,6.88,43.44,18c5.66,5.66,10.22,12.43,13.34,19.95 c3,7.24,4.66,15.18,4.66,23.49c0,16.96-6.88,32.33-18,43.44c-5.66,5.66-12.43,10.22-19.95,13.34c-7.24,3-15.18,4.66-23.49,4.66 c-8.31,0-16.25-1.66-23.49-4.66c-7.53-3.12-14.29-7.68-19.95-13.34C12.34,99.22,7.77,92.46,4.66,84.93C1.66,77.69,0,69.75,0,61.44 c0-8.31,1.66-16.25,4.66-23.49C7.77,30.42,12.34,23.66,18,18C23.65,12.34,30.42,7.77,37.95,4.66L37.95,4.66z M43.11,67.76 c-3.54-0.03-6.38-2.92-6.35-6.46c0.03-3.54,2.92-6.38,6.46-6.35l21.63,0.13l-7.82-7.95c-2.48-2.52-2.45-6.58,0.07-9.05 c2.52-2.48,6.57-2.45,9.05,0.08l18.67,18.97c2.45,2.5,2.45,6.49,0,8.98L66.52,84.72c-2.48,2.52-6.53,2.55-9.05,0.08 c-2.52-2.48-2.55-6.53-0.08-9.05l7.73-7.85L43.11,67.76L43.11,67.76z M42.86,16.55c-5.93,2.46-11.28,6.07-15.76,10.55 c-4.48,4.48-8.09,9.83-10.55,15.76c-2.37,5.71-3.67,11.99-3.67,18.58c0,6.59,1.31,12.86,3.67,18.58 c2.46,5.93,6.07,11.28,10.55,15.76c4.48,4.48,9.83,8.09,15.76,10.55c5.72,2.37,11.99,3.67,18.58,3.67c6.59,0,12.86-1.31,18.58-3.67 c5.93-2.46,11.28-6.07,15.76-10.55c4.48-4.48,8.09-9.82,10.55-15.76c2.37-5.71,3.67-11.99,3.67-18.58c0-6.59-1.31-12.86-3.67-18.58 c-2.46-5.93-6.07-11.28-10.55-15.76c-4.48-4.48-9.83-8.09-15.76-10.55c-5.71-2.37-11.99-3.67-18.58-3.67S48.58,14.19,42.86,16.55 L42.86,16.55z"/></g></svg>';
next_button.classList.add("next-button");
next_button_href = document.querySelector("section.real-section").getAttribute("data-0-next"); // should just be one
if (next_button_href) {
	next_button.href = "/" + next_button_href;
}

var prev_button = document.createElement("a");
prev_button.innerHTML = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width=100% viewBox="0 0 122.88 122.88" style="enable-background:new 0 0 122.88 122.88" xml:space="preserve"><g><path d="M84.93,4.66C77.69,1.66,69.75,0,61.44,0C44.48,0,29.11,6.88,18,18C12.34,23.65,7.77,30.42,4.66,37.95 C1.66,45.19,0,53.13,0,61.44c0,16.96,6.88,32.33,18,43.44c5.66,5.66,12.43,10.22,19.95,13.34c7.24,3,15.18,4.66,23.49,4.66 c8.31,0,16.25-1.66,23.49-4.66c7.53-3.12,14.29-7.68,19.95-13.34c5.66-5.66,10.22-12.43,13.34-19.95c3-7.24,4.66-15.18,4.66-23.49 c0-8.31-1.66-16.25-4.66-23.49c-3.12-7.53-7.68-14.29-13.34-19.95C99.22,12.34,92.46,7.77,84.93,4.66L84.93,4.66z M65.85,47.13 c2.48-2.52,2.45-6.58-0.08-9.05s-6.58-2.45-9.05,0.08L38.05,57.13c-2.45,2.5-2.45,6.49,0,8.98l18.32,18.62 c2.48,2.52,6.53,2.55,9.05,0.08c2.52-2.48,2.55-6.53,0.08-9.05l-7.73-7.85l22-0.13c3.54-0.03,6.38-2.92,6.35-6.46 c-0.03-3.54-2.92-6.38-6.46-6.35l-21.63,0.13L65.85,47.13L65.85,47.13z M80.02,16.55c5.93,2.46,11.28,6.07,15.76,10.55 c4.48,4.48,8.09,9.83,10.55,15.76c2.37,5.71,3.67,11.99,3.67,18.58c0,6.59-1.31,12.86-3.67,18.58 c-2.46,5.93-6.07,11.28-10.55,15.76c-4.48,4.48-9.83,8.09-15.76,10.55C74.3,108.69,68.03,110,61.44,110s-12.86-1.31-18.58-3.67 c-5.93-2.46-11.28-6.07-15.76-10.55c-4.48-4.48-8.09-9.82-10.55-15.76c-2.37-5.71-3.67-11.99-3.67-18.58 c0-6.59,1.31-12.86,3.67-18.58c2.46-5.93,6.07-11.28,10.55-15.76c4.48-4.48,9.83-8.09,15.76-10.55c5.71-2.37,11.99-3.67,18.58-3.67 C68.03,12.88,74.3,14.19,80.02,16.55L80.02,16.55z"/></g></svg>';
prev_button.classList.add("prev-button");
prev_button_href = document.querySelector("section.real-section").getAttribute("data-0-prev"); // should just be one
if (prev_button_href) {
	prev_button.href = "/" + prev_button_href;
}

// Add the next and prev button to the div container
// First get the div container
var next_prev_buttons = document.querySelector("div.next-prev-buttons");
next_prev_buttons.appendChild(prev_button);
next_prev_buttons.appendChild(next_button);