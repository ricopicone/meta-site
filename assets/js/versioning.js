
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
	var videopdf_container_div = button_div.parentElement;
	var iframes = videopdf_container_div.getElementsByTagName('iframe');
	if (iframes.length > 0) { // already has iframe
		for (let iframe of iframes) {
			if (iframe.classList.contains('hiddeniframe')) {
				videopdf_container_div.classList.remove('hiddenvideopdf-container')
				iframe.classList.remove('hiddeniframe')
			} else {
				videopdf_container_div.classList.add('hiddenvideopdf-container')
				iframe.classList.add('hiddeniframe')
				button_div.value = "video"
			}
		}
	} else { // no iframe -- create them!
		for (var i = 0; i < videopdf_container_div.dataset.embedcount; i++) {
			var iframe = document.createElement( "iframe" );
			iframe.setAttribute( "frameborder", "0" );
			iframe.setAttribute( "allowfullscreen", "" );
			iframe.setAttribute( "allow", "encrypted-media")
			videopdf_container_div.appendChild(iframe);
		}
		iframes = videopdf_container_div.getElementsByTagName('iframe'); // Now it has iframes
		var i = 1;
		for (let iframe of iframes) {
			var index_value = eval("videopdf_container_div.dataset.embedindex"+i)
			iframe.setAttribute( "src", "https://www.youtube-nocookie.com/embed?listType=playlist&list=PL"+ videopdf_container_div.dataset.embedplaylist +"&index=" + index_value );
			// iframe.classList.remove('hiddeniframe')
			i++;
		}
        videopdf_container_div.classList.remove('hiddenvideopdf-container')
	}
}

// Hide videopdf-container div if no video or if header has class 'faux'
document.querySelectorAll("div.videopdf-container").forEach(function(element) {
	// Get the previous header element (h1) of the videopdf-container
	var previous_sibling = element.previousElementSibling;
	while (previous_sibling && previous_sibling.tagName != 'H1') {
		previous_sibling = previous_sibling.previousElementSibling;
		console.log(previous_sibling);
	}
	var previous_header_element = previous_sibling;
	// Check if the previous header element is a real section and not a faux section
	console.log(previous_header_element);
	if (previous_header_element == null) {
		console.log("No previous header element found");
	}
	console.log(previous_header_element.classList);
	console.log(previous_header_element.classList.contains('real-section'));
	if (!previous_header_element.classList.contains('real-section') || previous_header_element.classList.contains('faux')) {
		// Print the previous header element class list
		element.style.display = 'none';
	} else {
		// Print the previous header element class list
		element.style.display = 'block';
	}
});

// Add a button that expands to a pdf preview from assets/split/partial
document.querySelectorAll("section.real-section.level1").forEach(function(element) {
	var section_number = element.getAttribute("data-0-sec");
	// Identify the pdf file, which has the format "x-y.pdf", whereas data-0-sec has the format "x.y" (x and y can be 1 or 2 digits). Return if there is no section number.
	if (!section_number) {
		return;
	}
	var pdf_filename = section_number.replace(/\./g, "-") + ".pdf";

	// Check if the pdf file exists
	var pdf_file_exists = false;
	var http = new XMLHttpRequest();
	http.onreadystatechange = function() {
		if (http.readyState === 4) { // 4 means the request is done
			if (http.status === 200) { // 200 means a successful return
				console.log("Request successful");
				if (http.status === 404) {
					console.log("PDF file not found: " + pdf_filename);
				} else if (http.status >= 200 && http.status < 300) {
					pdf_file_exists = true;
				} else {
					console.log("HTTP error: " + http.status);
				}
				// Add the pdf button if the pdf file exists
				if (pdf_file_exists) {
					// Add an anchor button with the text "PDF" that expands to a pdf preview and clicking on it opens the pdf file in a new tab
					var pdf_button = document.createElement("a");
					pdf_button.innerHTML = '<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC "-//W3C//DTD SVG 1.1//EN"  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg enable-background="new 0 0 500 500" id="Layer_1" version="1.1" viewBox="0 0 500 500" width="100%" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><line fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="133.661" x2="233.206" y1="126.169" y2="126.169"/><path d="  M233.206,126.169c7.22,0,13.136,5.94,13.136,13.112" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><line fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="246.342" x2="246.342" y1="139.281" y2="321.88"/><path d="  M246.342,321.88c0,7.184-5.94,13.111-13.136,13.111" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><line fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="233.206" x2="89.991" y1="334.991" y2="334.991"/><path d="  M89.991,334.991c-7.16,0-13.112-5.916-13.112-13.111" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><polyline fill="none" points="  76.879,321.88 76.879,178.7 133.661,126.169 " stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><line fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="136.341" x2="136.341" y1="126.169" y2="173.437"/><path d="  M136.341,173.437c0,3.852-3.2,7.039-7.039,7.039" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><line fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="129.302" x2="76.879" y1="180.476" y2="180.476"/><g><path clip-rule="evenodd" d="M319.217,285.176c4.117,3.43,6.182,8.741,6.182,15.865   c0,7.159-2.125,12.411-6.314,15.743c-4.202,3.309-10.637,4.999-19.317,4.999h-10.492v17.325h-9.973v-59.1h20.296   C308.568,280.009,315.1,281.747,319.217,285.176L319.217,285.176z M312.166,309.589L312.166,309.589   c1.992-2.137,2.981-5.24,2.981-9.333s-1.255-6.99-3.791-8.681c-2.56-1.69-6.507-2.535-11.952-2.535h-10.13v23.688h11.591   C306.383,312.728,310.149,311.665,312.166,309.589z" fill="#000000" fill-rule="evenodd"/><path clip-rule="evenodd" d="M381.865,287.76c5.699,5.119,8.536,12.315,8.536,21.515   c0,9.164-2.765,16.444-8.271,21.805c-5.529,5.361-13.98,8.029-25.378,8.029h-19.619v-59.1h20.295   C368.029,280.009,376.179,282.568,381.865,287.76L381.865,287.76z M380.345,309.517L380.345,309.517   c0-13.522-7.764-20.308-23.254-20.308h-9.973v40.519h11.071c7.147,0,12.641-1.703,16.456-5.096   C378.449,321.203,380.345,316.181,380.345,309.517z" fill="#000000" fill-rule="evenodd"/><polygon clip-rule="evenodd" fill="#000000" fill-rule="evenodd" points="413.22,289.306 413.22,305.544 439.443,305.544    439.443,314.756 413.22,314.756 413.22,339.108 403.247,339.108 403.247,280.009 442.655,280.009 442.57,289.306  "/></g><line clip-rule="evenodd" fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="279.772" x2="455.706" y1="245.262" y2="245.262"/><path clip-rule="evenodd" d="  M455.706,245.262c10.674,0,19.294,8.645,19.294,19.293" fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><line clip-rule="evenodd" fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="475" x2="475" y1="264.555" y2="354.563"/><path clip-rule="evenodd" d="  M475,354.563c0,10.648-8.62,19.269-19.294,19.269" fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><line clip-rule="evenodd" fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="455.706" x2="44.293" y1="373.831" y2="373.831"/><path clip-rule="evenodd" d="  M44.293,373.831c-10.648,0-19.293-8.62-19.293-19.269" fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><line clip-rule="evenodd" fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="25" x2="25" y1="354.563" y2="264.555"/><path clip-rule="evenodd" d="  M25,264.555c0-10.648,8.645-19.293,19.293-19.293" fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10"/><line clip-rule="evenodd" fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="163.349" x2="163.349" y1="186.874" y2="303.673"/><line clip-rule="evenodd" fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="163.349" x2="200.317" y1="303.673" y2="266.691"/><line clip-rule="evenodd" fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="2.6131" stroke-width="10" x1="163.349" x2="122.903" y1="303.673" y2="263.203"/></svg>';
					pdf_button.classList.add("pdf-button");
					pdf_button.href = "/assets/split/partial/" + pdf_filename;
					pdf_button.target = "_blank";
					// Add the pdf button at the end of the videopdf-container div
					var videopdf_container = document.querySelector("div.videopdf-container");
					videopdf_container.appendChild(pdf_button);
				}
			} else {
				console.error("Request failed with status: " + http.status);
			}
		}
	};
	http.open('HEAD', "/assets/split/partial/" + pdf_filename, true); // true for asynchronous
	http.send();
});

// Add fixed next and previous buttons to the bottom of the page in a div container
var next_prev_buttons = document.createElement("div");
next_prev_buttons.classList.add("next-prev-buttons");
document.body.appendChild(next_prev_buttons);

var next_button = document.createElement("a");
next_button.innerHTML = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" viewBox="0 0 122.88 122.88" style="enable-background:new 0 0 122.88 122.88" xml:space="preserve"><g><path d="M37.95,4.66C45.19,1.66,53.13,0,61.44,0c16.96,0,32.33,6.88,43.44,18c5.66,5.66,10.22,12.43,13.34,19.95 c3,7.24,4.66,15.18,4.66,23.49c0,16.96-6.88,32.33-18,43.44c-5.66,5.66-12.43,10.22-19.95,13.34c-7.24,3-15.18,4.66-23.49,4.66 c-8.31,0-16.25-1.66-23.49-4.66c-7.53-3.12-14.29-7.68-19.95-13.34C12.34,99.22,7.77,92.46,4.66,84.93C1.66,77.69,0,69.75,0,61.44 c0-8.31,1.66-16.25,4.66-23.49C7.77,30.42,12.34,23.66,18,18C23.65,12.34,30.42,7.77,37.95,4.66L37.95,4.66z M43.11,67.76 c-3.54-0.03-6.38-2.92-6.35-6.46c0.03-3.54,2.92-6.38,6.46-6.35l21.63,0.13l-7.82-7.95c-2.48-2.52-2.45-6.58,0.07-9.05 c2.52-2.48,6.57-2.45,9.05,0.08l18.67,18.97c2.45,2.5,2.45,6.49,0,8.98L66.52,84.72c-2.48,2.52-6.53,2.55-9.05,0.08 c-2.52-2.48-2.55-6.53-0.08-9.05l7.73-7.85L43.11,67.76L43.11,67.76z M42.86,16.55c-5.93,2.46-11.28,6.07-15.76,10.55 c-4.48,4.48-8.09,9.83-10.55,15.76c-2.37,5.71-3.67,11.99-3.67,18.58c0,6.59,1.31,12.86,3.67,18.58 c2.46,5.93,6.07,11.28,10.55,15.76c4.48,4.48,9.83,8.09,15.76,10.55c5.72,2.37,11.99,3.67,18.58,3.67c6.59,0,12.86-1.31,18.58-3.67 c5.93-2.46,11.28-6.07,15.76-10.55c4.48-4.48,8.09-9.82,10.55-15.76c2.37-5.71,3.67-11.99,3.67-18.58c0-6.59-1.31-12.86-3.67-18.58 c-2.46-5.93-6.07-11.28-10.55-15.76c-4.48-4.48-9.83-8.09-15.76-10.55c-5.71-2.37-11.99-3.67-18.58-3.67S48.58,14.19,42.86,16.55 L42.86,16.55z"/></g></svg>';
next_button.classList.add("next-button");
next_button_href = document.querySelector("section.real-section.level1").getAttribute("data-0-next"); // should just be one
console.log(next_button_href);
if (next_button_href) {
	next_button.href = "/" + next_button_href;
}

var prev_button = document.createElement("a");
prev_button.innerHTML = '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width=100% viewBox="0 0 122.88 122.88" style="enable-background:new 0 0 122.88 122.88" xml:space="preserve"><g><path d="M84.93,4.66C77.69,1.66,69.75,0,61.44,0C44.48,0,29.11,6.88,18,18C12.34,23.65,7.77,30.42,4.66,37.95 C1.66,45.19,0,53.13,0,61.44c0,16.96,6.88,32.33,18,43.44c5.66,5.66,12.43,10.22,19.95,13.34c7.24,3,15.18,4.66,23.49,4.66 c8.31,0,16.25-1.66,23.49-4.66c7.53-3.12,14.29-7.68,19.95-13.34c5.66-5.66,10.22-12.43,13.34-19.95c3-7.24,4.66-15.18,4.66-23.49 c0-8.31-1.66-16.25-4.66-23.49c-3.12-7.53-7.68-14.29-13.34-19.95C99.22,12.34,92.46,7.77,84.93,4.66L84.93,4.66z M65.85,47.13 c2.48-2.52,2.45-6.58-0.08-9.05s-6.58-2.45-9.05,0.08L38.05,57.13c-2.45,2.5-2.45,6.49,0,8.98l18.32,18.62 c2.48,2.52,6.53,2.55,9.05,0.08c2.52-2.48,2.55-6.53,0.08-9.05l-7.73-7.85l22-0.13c3.54-0.03,6.38-2.92,6.35-6.46 c-0.03-3.54-2.92-6.38-6.46-6.35l-21.63,0.13L65.85,47.13L65.85,47.13z M80.02,16.55c5.93,2.46,11.28,6.07,15.76,10.55 c4.48,4.48,8.09,9.83,10.55,15.76c2.37,5.71,3.67,11.99,3.67,18.58c0,6.59-1.31,12.86-3.67,18.58 c-2.46,5.93-6.07,11.28-10.55,15.76c-4.48,4.48-9.83,8.09-15.76,10.55C74.3,108.69,68.03,110,61.44,110s-12.86-1.31-18.58-3.67 c-5.93-2.46-11.28-6.07-15.76-10.55c-4.48-4.48-8.09-9.82-10.55-15.76c-2.37-5.71-3.67-11.99-3.67-18.58 c0-6.59,1.31-12.86,3.67-18.58c2.46-5.93,6.07-11.28,10.55-15.76c4.48-4.48,9.83-8.09,15.76-10.55c5.71-2.37,11.99-3.67,18.58-3.67 C68.03,12.88,74.3,14.19,80.02,16.55L80.02,16.55z"/></g></svg>';
prev_button.classList.add("prev-button");
prev_button_href = document.querySelector("section.real-section.level1").getAttribute("data-0-prev"); // should just be one
if (prev_button_href) {
	prev_button.href = "/" + prev_button_href;
}

// Add the next and prev button to the div container
// First get the div container
var next_prev_buttons = document.querySelector("div.next-prev-buttons");
next_prev_buttons.appendChild(prev_button);
next_prev_buttons.appendChild(next_button);