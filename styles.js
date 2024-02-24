var timeString=function(e){if(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(e)){var n=e,a=n.substring(0,4),t=n.substring(5,7),i=n.substring(8,10),s=[];return s[1]="Jan",s[2]="Feb",s[3]="Mar",s[4]="Apr",s[5]="May",s[6]="Jun",s[7]="Jul",s[8]="Aug",s[9]="Sep",s[10]="Oct",s[11]="Nov",s[12]="Dec",i+" "+s[parseInt(t,10)]+" "+a}return!1},imageString=function(e){var n=e.indexOf("<img"),a=e.indexOf('src="',n),t=e.indexOf('"',a+5),i=e.substr(a+5,t-a-5);return -1!=n&&-1!=a&&-1!=t&&""!=i?i:"https://1.bp.blogspot.com/-BYDJ1dpFEhE/X9QnAUfeORI/AAAAAAAAHxw/OjfaqiPHjhAmCgJts39XIg7o4KR-8YtdACNcBGAsYHQ/w300-h225-p-k-no-nu/dagruel-no-image.png"},update={mainItemArr:[],subItemArr:[],compile:function(e){var n=e.feed.entry;if(!n)return!1;var a=document.getElementById("Update");if(!a)return!1;if(a.dataset.created="Dagruel",n.forEach(function({category:e,content:n,link:a,title:t,published:i,media$thumbnail:s}){var r=t.$t,l=e.map(function(e){return e.term}),o=a.find(function(e){if("alternate"===e.rel)return e}).href,c="function"==typeof timeAgo?timeAgo(new Date(i.$t)):timeString(i.$t),u=n.$t&&n.$t.length>0?n.$t:"Nothing",d=s?s.url.replace("s72","w175-h235"):imageString(u);l=l.filter(function(e){if("Project"!==e)return e}),update.mainItem.filter(function(e){l.join(", ").includes(e)&&update.mainItemArr.push({title:r,link:o,image:d,category:l})}),update.subItem.filter(function(e){l.join(", ").includes(e)&&update.subItemArr.push({titleSub:r,linkSub:o,publishedSub:c,categorySub:l})})}),update.mainItemArr.length>0){var t="";update.mainItemArr.forEach(function({title:e,link:n,image:a,category:i}){var s="",r="",l=i.find(e=>"رائج, جديد".includes(e));r="رائج"==l?"<span class='hot absolute r-5 t-3'></span>":"جديد"==l?"<span class='new absolute r-5 t-3'></span>":"";var o="",c=i.find(e=>"مانجا, مانها, مانهوا, ويب تون, رواية".includes(e));o="مانجا"==c?"<span class='colored manga'><span class='iconify mr-3'  data-icon='emojione-monotone:japanese-congratulations-button' data-inline='false'/></span>مانجا":"مانها"==c?"<span class='colored manhua'>مانها</span>":"مانهوا"==c?"<span class='colored manhwa'>مانهوا</span>":"ويب تون"==c?"<span class='colored webtoon'><span class='iconify mr-3' data-icon='simple-icons:webtoon' data-inline='false'/></span>ويب تون":"رواية"==c?"<span class='colored novel'><span class='iconify mr-3' data-icon='zondicons:book-reference' data-inline='false'/></span>رواية":"",console.log(`${l} & ${r}`),update.subItemArr.length>0&&update.subItemArr.forEach(function({titleSub:e,linkSub:n,publishedSub:a,categorySub:t}){var r=e;update.settingTitle.forEach(function({name:n,news:a}){r.includes(n)&&(r=a+" "+e.split(n)[1].replace(/[^0-9\.-]+/g,""))}),t.filter(function(t){i.join(", ").includes(t)&&(s+='<li class="char"><div class="chpName" style="display: flex;justify-content: space-between;"><a href="'+n+'" title="'+e+'">'+r+'</a><time class="chpDate">'+a+"</time></div></li>")})}),t+='<div class="bookItem bb-1pxsf"><a href="'+n+'" title="'+e+'"><div class="snippet-thumbnail"><img loading="lazy" src="'+a+'"/>'+r+o+'</div></a><div class="data"><h2><a href="'+n+'" title="'+e+'">'+e+'</a></h2><ul class="subItem">'+s+"</ul></div></div>"}),a.innerHTML=t}},run:function(e,n){var a=document.createElement("script");a.src="/feeds/posts/default/-/"+e+"?orderby=published&alt=json-in-script&max-results="+n+"&callback=update.compile",document.body.appendChild(a)}};update.mainItem=["Series"],update.subItem=["Chapter"],update.settingTitle=[{name:"الفصل",news:"فصـ . "},{name:"Episode",news:"Ep"}];
const mTP = {
    shuffleArray: array => {
        let currentIndex = array.length, randomIndex, temporaryValue;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },
    run: (jQuery, showCategories, maxPosts, maxCategories) => {
        if (jQuery("#mTP_Slider").length === 0) {
            return console.log("العنصر mTP_Slider غير موجود");
        }

        mTP.maxCategories = maxCategories;
        mTP.maxPosts = maxPosts;

        if (window.matchMedia("(max-width: 600px)").matches) {
            mTP.maxCategories = 3;
        }
        if (window.matchMedia("(max-width: 480px)").matches) {
            mTP.maxCategories = 2;
        }

        const categorySlug = showCategories ? `/-/${showCategories}` : '';
        jQuery.ajax({
            url: `/feeds/posts/default${categorySlug}?alt=json-in-script&max-results=150`,
            type: "get",
            dataType: "jsonp",
            success: function(data) {
                mTP.compile(jQuery, data);
            },
            error: function(error) {
                console.log(error);
            }
        });
    },
    compile: (jQuery, data) => {
        if ("entry" in data.feed) {
            const shuffledEntries = mTP.shuffleArray(data.feed.entry);
            
            mTP.filter = mTP.shuffleArray(data.feed.category.map(category => category.term)
                .filter(category => mTP.Select.includes(category))).slice(0, mTP.maxCategories);
            
            mTP.categoriesData = {};
            jQuery.each(mTP.filter, function(index, category) {
                shuffledEntries.filter(entry => {
                    const entryCategories = entry.category.map(cat => cat.term);
                    if (entryCategories.includes(category)) {
                        const categoryData = mTP.categoriesData[category] || [];
                        if (categoryData.length < mTP.maxPosts) {
                            categoryData.push({
                                title: entry.title.$t,
                                categories: entryCategories,
                                link: entry.link.find(link => link.rel === "alternate").href,
                                image: "media$thumbnail" in entry ?
                                    entry.media$thumbnail.url.replace(/\/s[0-9]{2}-(w[0-9]+-)?c/,
                                    `/${mTP.iSize}-p-k-no-nu`):
                                    "content" in entry ? jQuery(entry.content.$t).find("img").attr("src") :
                                    mTP.noImage,
                                score: entryCategories.find(label => !/[^0-9\.-]+/g.test(label)) || '0.0',
                                chapter: entryCategories.find(label => !/[^0-9\-]+/g.test(label)) || '',
                                episode: entryCategories.find(label => !/[^0-9\-]+/g.test(label)) || '',
                                status: entryCategories.find(label => ['قريبا', 'مستمرة', 'مكتملة', 'ملغاة'].includes(label)) || false,
                                tipe: entryCategories.find(label => ['مانجا', 'مانهوا', 'ون شوت', 'ويب تون', 'رواية', 'مانها'].includes(label)) || false
                            });
                        }
                        mTP.categoriesData[category] = categoryData;
                    }
                });
            });
            
            const sliderContainer = jQuery('<div class="series-gen"><div class="head"><div class="r-title"></div><ul class="nav-tabs tabs tab r2"></ul></div><div class="listupd"></div></div>');
            const sortedCategories = Object.keys(mTP.categoriesData).sort().reduce((sorted, category) => {
                sorted[category] = mTP.categoriesData[category];
                return sorted;
            }, {});

            jQuery.each(sortedCategories, function(category, entries) {
                const categorySlug = category.replace(/\W/g, "");
                const categorySlugEnglish = mTP.englishSlugMap[category];
                sliderContainer.find(".nav-tabs").append(`<li><span data-id="series-${categorySlugEnglish}">${category}</span></li>`);
                sliderContainer.find(".listupd").append(`<div id="series-${categorySlugEnglish}" class="customAF scroll"><div class="inner scrolling"></div></div>`);
                jQuery.each(entries, function() {
                    const title = this.title;
                    const score = this.score;
                    const chapter = this.chapter;
                    const episode = this.episode;
                    const link = this.link;
                    const status = this.status;
                    const tipe = this.tipe;
                    const image = this.image;

                    const details = [
                        status && `<span style="z-index:1;" class="absolute ong ttu fs-11">${status}</span>`,
                        episode && `<span class='absolute ttu fs-11 mo' style='z-index:1;'>Episode ${episode}</span>`,
                        chapter && `<span class='absolute ttu fs-11 mo' style='z-index:1;'>Chapter ${chapter}</span>`,
                        `<img loading="lazy" src="${image}" alt="${title}"/>`
                    ];

                    if (tipe === 'مانجا') {
                        details.push(`<svg class='absolute b-5 r-5 c-fff s2' viewBox='0 0 640 480' xmlns='http://www.w3.org/2000/svg'><defs><clipPath id='a'><path d='M-88.001 32h640v480h-640z' fill-opacity='.67'/></clipPath></defs><g clip-path='url(#a)' fill-rule='evenodd' stroke-width='1pt' transform='translate(88.001 -32)'><path d='M-128 32h720v480h-720z' fill='#fff'/><circle cx='523.08' cy='344.05' fill='#d30000' r='194.93' transform='translate(-168.44 8.618) scale(.76554)'/></g></svg>`);
                    } else if (tipe === 'مانها') {
                        details.push(`<svg class='absolute b-5 r-5 c-fff s2' viewBox='0 0 640 480' xmlns='http://www.w3.org/2000/svg'><defs><clipPath id='a'><path d='M-95.808-.44h682.67v512h-682.67z' fill-opacity='.67'/></clipPath></defs><g clip-path='url(#a)' fill-rule='evenodd' transform='translate(89.82 .412) scale(.9375)'><path d='M610.61 511.56h-730.17v-512h730.17z' fill='#fff'/><path d='M251.871 256.021c0 62.137-50.372 112.508-112.507 112.508-62.137 0-112.507-50.372-112.507-112.508 0-62.137 50.371-112.507 112.507-112.507 62.137 0 112.507 50.372 112.507 112.507z' fill='#fff'/><path d='M393.011 262.55c0 81.079-65.034 146.803-145.261 146.803S102.488 343.63 102.488 262.55s65.034-146.804 145.262-146.804S393.01 181.471 393.01 262.55z' fill='#c70000'/><path d='M-49.417 126.44l83.66-96.77 19.821 17.135-83.66 96.771zM-22.018 150.127l83.66-96.77 19.82 17.135-83.66 96.77z'/><path d='M-49.417 126.44l83.66-96.77 19.821 17.135-83.66 96.771z'/><path d='M-49.417 126.44l83.66-96.77 19.821 17.135-83.66 96.771zM5.967 174.32l83.66-96.77 19.82 17.136-83.66 96.77z'/><path d='M-49.417 126.44l83.66-96.77 19.821 17.135-83.66 96.771z'/><path d='M-49.417 126.44l83.66-96.77 19.821 17.135-83.66 96.771zM459.413 29.638l83.002 97.335-19.937 17-83.002-97.334zM403.707 77.141l83.002 97.335-19.936 17-83.002-97.334z'/><path d='M417.55 133.19l78.602-67.814 14.641 16.953-83.996 75.519-9.247-24.659z' fill='#fff'/><path d='M514.228 372.013l-80.416 95.829-19.716-16.4 80.417-95.828zM431.853 53.14l83.002 97.334-19.936 17.001-83.002-97.334zM541.475 394.676l-80.417 95.829-19.715-16.399 80.417-95.829zM486.39 348.857l-80.417 95.83-19.715-16.4 80.416-95.829z'/><path d='M104.6 236.68c4.592 36.974 11.297 78.175 68.199 82.455 21.328 1.278 62.817-5.074 77.061-63.19 18.688-55.829 74.975-71.88 113.28-41.613 21.718 14.166 27.727 36.666 29.283 53.557-1.739 54.243-32.874 101.2-72.823 122.14-45.93 27.3-109.56 27.87-165.3-13.49-25.12-23.57-60.219-67.02-49.7-139.86z' fill='#3d5897'/><path d='M435.91 370.59l78.734 67.661-14.591 16.997-87.156-71.851 23.013-12.807z' fill='#fff'/><path d='M-1.887 357.197l83.002 97.335-19.937 17-83.002-97.334z'/><path d='M-16.188 437.25l78.602-67.814 14.641 16.953-83.996 75.519-9.247-24.659z' fill='#fff'/><path d='M25.672 333.696l83.003 97.334-19.937 17-83.002-97.334zM-30.033 381.199l83.002 97.334-19.936 17L-49.97 398.2z'/></g></svg>`);
                    } else if (tipe === 'مانهوا') {
                        details.push(`<svg class='absolute b-5 r-5 c-fff s2' viewBox='0 0 30 20' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
              <defs>
                <path d='M0,-1 0.587785,0.809017 -0.951057,-0.309017H0.951057L-0.587785,0.809017z' fill='#FFFF00' id='s'/>
              </defs>
              <rect fill='#EE1C25' height='20' width='30'/>
              <use transform='translate(5,5) scale(3)' xlink:href='#s'/>
              <use transform='translate(10,2) rotate(23.036243)' xlink:href='#s'/>
              <use transform='translate(12,4) rotate(45.869898)' xlink:href='#s'/>
              <use transform='translate(12,7) rotate(69.945396)' xlink:href='#s'/>
              <use transform='translate(10,9) rotate(20.659808)' xlink:href='#s'/>
            </svg>`);
                    } else if (tipe === 'ويب تون') {
                        details.push(`<span class='colored webtoon'><span class='iconify mr-3' data-icon='simple-icons:webtoon' data-inline='false'></span>ويب تون</span>`);
                    } else if (tipe === 'رواية') {
                        details.push(`<span class='colored novel'><span class='iconify mr-3' data-icon='zondicons:book-reference' data-inline='false'></span>رواية</span>`);
                    }

                    const detailsString = details.filter(Boolean).join('');

                    let post = `<article class="customAgata">\n<a href="${link}" title="${title}">\n<div class="images">\n<figure>`;
                    post += detailsString;
                    post += `</figure></div>`;
                    post += `<h2 class="entry-title">${title}</h2>`;
                    post += '<div class="rating"><div class="rating-prc"><div class="rtp"><div class="rtb">';
                    post += `<span style="width:${score.length == 4 ? score == '10.0' ? score.replace('.', '') : score.replace('.', '').slice(0, -1) : score.replace('.', '')}%"></span>`;
                    post += `</div></div><div class="num" content="${score}">${score}</div></div></div>`
                    post += `</a></article>`;
                    sliderContainer.find(`#series-${categorySlugEnglish} .inner`).append(post);
                });
            });

            jQuery("#mTP_Slider").html(sliderContainer);

            jQuery(".nav-tabs li").click(function() {
                const targetId = jQuery(this).find("span").attr("data-id");
                jQuery(".customAF.scroll, .nav-tabs li").each(function() {
                    if (jQuery(this).attr("id") === targetId || jQuery(this).find("span").attr("data-id") === targetId) {
                        jQuery(this).addClass("active");
                    } else {
                        jQuery(this).removeClass("active");
                    }
                });
            });

            jQuery(".nav-tabs li").first().click();
        }
    },
    iSize: "w207-h300",
    noImage: "https://1.bp.blogspot.com/-BYDJ1dpFEhE/X9QnAUfeORI/AAAAAAAAHxw/OjfaqiPHjhAmCgJts39XIg7o4KR-8YtdACNcBGAsYHQ/w300-h225-p-k-no-nu/dagruel-no-image.png",
    englishSlugMap: {"تاريخي": "history","أكشن": "action","مغامرات": "adventure","كوميديا": "comedy","دراما": "drama","إيتشي": "ecchi","فانتازيا": "fantasy", "ألعاب": "game","حريم": "harem","إيسيكاي": "isekai","رعب": "horror","جوسي": "josei", "سحر": "magic","ميكا": "mecha","عسكري": "military","موسيقى": "music","غموض": "mystery", "شرطة": "police","نفسي": "psychological","رومانسي": "romance","ساموراي": "samurai","مدرسة": "school","حياة مدرسية": "school-life",
    "خيال علمي": "sci-fi","سينين": "seinen","شوجو": "shoujo","شونين": "shounen","حياة يومية": "slice-of-life","فضاء": "space","رياضة": "sports",
    "قوى خارقة": "super-power","خارق للطبيعة": "supernatural","إثارة": "thriller","مصاصي الدماء": "vampire"}

};
mTP.Select = ["أكشن", "مغامرات", "كوميديا", "دراما", "إيتشي", "فانتازيا", "ألعاب", "حريم", "تاريخي", "إيسيكاي", "رعب", "جوسي", "سحر", "ميكا", "عسكري", "موسيقى", "غموض", "شرطة", "نفسي", "رومانسي", "ساموراي", "مدرسة", "حياة مدرسية", "خيال علمي", "سينين", "شوجو", "شونين", "حياة يومية", "فضاء", "رياضة", "قوى خارقة", "خارق للطبيعة", "إثارة", "مصاصي الدماء"];
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('Update').style.display = "grid";
    var listupdElement = document.querySelector('.listupd');
    if (listupdElement) {
      listupdElement.parentNode.removeChild(listupdElement);
    }
  });

function getRandomInt(s,e){return Math.floor(Math.random()*(e-s+1))+s}function shuffleArray(s){var e,a,t=s.length;if(0===t)return!1;for(;--t;)e=Math.floor(Math.random()*(t+1)),a=s[t],s[t]=s[e],s[e]=a;return s}function postarea4(e){j=showRandomImg?Math.floor((imgr.length+1)*Math.random()):0,img=new Array,postnum4<=e.feed.entry.length?maxpost=postnum5:maxpost=e.feed.entry.length,document.write('<div class="ct-wrapper"><div class="owl_carouselle owl-carousel">');for(var t=shuffleArray(e.feed.entry),i=0;i<maxpost;i++){for(var r,n=t[i],l=n.title.$t,o=[],c=0;c<1;c++)o='<div class="site-ret"><span class="fa fa-star" aria-hidden="true"><span>'+e.feed.entry[i].category[0].term+"</div>";for(p=[],sx=0;sx<n.category.length;sx++)if("مانجا"==n.category[sx].term)var p='<span class="type-poss">مانجا</span>';else"مانها"==n.category[sx].term?p='<span class="type-poss">مانها</span>':"Komik"==n.category[sx].term?p='<span class="type-poss">كوميك</span>':"مانهوا"==n.category[sx].term?p='<span class="type-poss">مانهوا</span>':"ويب تون"==n.category[sx].term?p='<span class="type-poss">ويب تون</span>':"رواية"==n.category[sx].term&&(p='<span class="type-poss">رواية</span>');for(m=[],stt=0;stt<n.category.length;stt++)if("مكتمل"==n.category[stt].term)var m='<span class="stts-poss">مكتمل</span>';else"قريبا"==n.category[stt].term?m='<span class="stts-poss">قريبا</span>':"مستمرة"==n.category[stt].term&&(m='<span class="stts-poss">مستمر</span>');for(var g="",f=0;f<n.category.length;f++)g+='<a class="label label-slider" href="/search/label/'+n.category[f].term+'">'+n.category[f].term+"</a>";if(i==e.feed.entry.length)break;for(var v=0;v<n.link.length;v++)if("alternate"==n.link[v].rel){r=n.link[v].href;break}for(v=0;v<n.link.length;v++)if("replies"==n.link[v].rel&&"text/html"==n.link[v].type){n.link[v].title.split(" ")[0];break}if("content"in n)var u=n.content.$t;else u="summary"in n?n.summary.$t:"";if((u=u.replace(/<\S[^>]*>/g,"")).length<200)break;var h=(u=u.substring(0,200)).lastIndexOf(" ");u=u.substring(0,h),postdate=n.published.$t,j>imgr.length-1&&(j=0),img[i]="",s=u,a=s.indexOf("<img"),b=s.indexOf('src="',a),x=s.indexOf('"',b+5),d=s.substr(b+5,x-b-5),-1!=a&&-1!=b&&-1!=x&&""!=d&&(img[i]=0==i?'<img min-width="620" min-height="240" class="odd-img owl-lazy lazy" data-src="'+d+'"/>':'<img class="lazy alignright" min-height="100" data-src="'+d+'" width="150"/>');for(var y=[1,2,3,4,5,6,7,8,9,10,11,12],k=["January","February","March","April","May","June","July","August","September","October","November","December"],w=(postdate.split("-")[2].substring(0,2),postdate.split("-")[1]),A=(postdate.split("-")[0],0);A<y.length;A++)if(parseInt(w)==y[A]){w=k[A];break}var x=n.content.$t,M=$(x).find("p").html();M="undefined"!=$(x).find("p").html()&&null!=$(x).find("p").html()?$(x).find("p").html():"undefined"!=$(x).find(".descManga").html()&&null!=$(x).find(".descManga").html()?$(x).find(".descManga").html():"...لا يوجد وصف";var S=(A=$("<div>").html(x)).find("img:first").attr("src"),z=e.feed.entry[i].media$thumbnail.url;if(-1!=z.indexOf("img.youtube.com")&&(z=e.feed.entry[i].media$thumbnail.url.replace("default","maxresdefault")),z=z.replace("/s72-c/","/s720/"),x="http://1.bp.blogspot.com/-S5pmP6Y0KUs/V6CsQEqKNGI/AAAAAAAAEFY/LZigJ20wKVkpzFLJSuzvjJDkC9z9IFy5wCK4B/s1600/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png",void 0===S)if(e.feed.entry[i].media$thumbnail)var I='<a href="'+r+'" class="slider-image" style="background:url('+z+') no-repeat center center;background-size: cover;width: 100%;height: 420px;display:block;image-rendering: -webkit-optimize-contrast;"/>';else I='<a href="'+r+'" class="noimg slider-image" style="background:url('+x+') no-repeat center center; display:block;"/>';else I='<a href="'+r+'" class="slider-image" style="background:url('+z+') no-repeat center center;background-size: cover; display:block;"/>';var C='<div class="slider-item"><div class="slider-wrapp"><div class="thumb overlay">'+I+'</div><div class="owl-controls"><div class="owl-page active"></div><div class="owl-page"></div><div class="owl-page"></div><div class="owl-page"></div></div><div class="covert">'+I+'</div><div class="post-descript"><div class="post-title"><div class="right-title"style="padding-top: 20px;"><div class="post-titlenya"><a href="'+r+'">'+l+'</a></div></div><div class="post-meta"><div class="post-tr">'+o+'</div></div></div><div class="flex" style="gap: 10px;padding-top: 20px;"><div class="post-tag"><span class="type-text">النوع: </span>'+p+'</div><div class="stats-poss"><span class="type-text">الحالة: </span>'+m+'</div></div><div class="post-genre"><div class="genre-slide">'+g+'</div></div><div class="post-sinop"> <strong>القصة: </strong><p>'+M+'</p></div><div class="start-reading"><a href="'+r+'"><span>ابدأ القراءة <i class="fas fa-long-arrow-alt-left mr-7"></i></span></a></div></div><div class="clear"></div></div></div>';document.write(C),j++}document.write("</div></div>")}cat1="Featured",imgr=new Array,imgr[0]="http://3.bp.blogspot.com/-zP87C2q9yog/UVopoHY30SI/AAAAAAAAE5k/AIyPvrpGLn8/s1600/picture_not_available.png",showRandomImg=!0,aBold=!0,summaryPost=150,summaryTitle=50,postnum1=1,postnum4=8,postnum5=8,$(document).ready(function(){$(".owl_carouselle").owlCarousel({autoplay:!0,loop:!0,lazy:!0,rtl:true,nav:!1,dots:!0,video:!0,navText:["<i class='fa fa-angle-right'></i>","<i class='fa fa-angle-left'></i>"],smartSpeed:1200,responsiveClass:!0,responsive:{0:{items:1},600:{items:1},1000:{items:1}}})});
const epX = {
  arr: [],
  config: { max: 150, start: 1, labelMain: "Series" },
  getDate(t) {
    if (/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(t)) {
      var e = t.substring(0, 4),
        a = t.substring(5, 7),
        i = t.substring(8, 10),
        s = [];
      return (
        (s[1] = "يناير"),
        (s[2] = "فبراير"),
        (s[3] = "مارس"),
        (s[4] = "أبريل"),
        (s[5] = "ماي"),
        (s[6] = "يونيو"),
        (s[7] = "يوليو"),
        (s[8] = "أغسطس"),
        (s[9] = "سبتمبر"),
        (s[10] = "أكتوبر"),
        (s[11] = "نوفمبر"),
        (s[12] = "ديسمبر"),
        i + " " + s[parseInt(a, 10)] + " " + e
      );
    }
    return !1;
  },
  sort: (t) => t.sort((t, e) => t.title.localeCompare(e.title, void 0, { numeric: !0 })),
  compile: function () {
    let t = this.sort(this.arr).reverse(),
      e = this.config,
      a = "",
      i,
      s;
    $.each(t, function (t, l) {
      if (!l.cat.includes("Series")) {
        let n = ["الفصل"].find((t) => l.title.includes(t)),
          r = n
            ? l.title.split(n)[1].replace(/[^0-9\.-]+/g, "")
            : l.title.replace(/\D/g, "");
        if (l.content) {
          let c = $(l.content.replaceAll("src=", "scr=")).find("#downloadBtn");
          l.dLink = c.length ? c.attr("href") : "";
        }
        l.titleModified = n ? n + " " + r : l.title;
        l.titleNumeric = parseInt(r);
        a += `<li data-numb="${r}"><div class="chbox"><div class="eph-num"><a href="${l.url}" style="display: flex;gap: 10px;justify-content: center;align-items: center;">
  <span><span class="chapternum">${l.titleModified}</span>
  <span class="chapterdate">${l.date}</span></span></a>
</div>`;
        l.dLink && (a += `<div class="dt"><a href="${l.dLink}" rel="nofollow" class="dload" target="_blank"><i class="fa-solid fa-cloud-arrow-down"></i></a></div>`);
        a += "</div></li>";
        if ("الفصل" == n) {
          (!i || l.titleNumeric < i.titleNumeric) && (i = l);
          (!s || l.titleNumeric > s.titleNumeric) && (s = l);
        }
      }
    });
    if (i) {
      let l = i.title.replace(/\D/g, ""),
        n = `<div class="inepcx" data-id="1"><a href="${i.url}"><span>بداية العمل: فـ . </span><span class="epcur epcurfirst">${l}</span></a></div>`;
      $("#firstLastChapters").append(n);
    }
    if (a.length > 0) {
      $("#epX").append(`<ul class="clstyle">${a}</ul>`);
    }
    if (s) {
      let r = s.title.replace(/\D/g, ""),
        c = `<div class="inepcx" data-id="2"><a href="${s.url}"><span> آخـر إصـدار: فـ . </span><span class="epcur epcurlast">${r}</span></a></div>`;
      $("#firstLastChapters").append(c);
    }
  },
  xhr: function () {
    let t = this,
      e = t.config;
    $.ajax({
      type: "get",
      url: `${e.site || ""}/feeds/posts/default/-/${e.cat}`,
      data: { alt: "json", "start-index": e.start, "max-results": e.max },
      dataType: "jsonp",
      success: function (a) {
        if ("entry" in a.feed) {
          $.each(a.feed.entry, function (e, a) {
            t.arr.push({
              title: a.title.$t,
              date: t.getDate(a.published.$t),
              url: a.link.find((t) => "alternate" == t.rel).href,
              cat: a.category.map((t) => t.term),
              content: "content" in a && a.content.$t,
            });
          });
          if (a.feed.entry.length >= e.max) {
            e.start += e.max;
            t.xhr();
          } else {
            t.compile();
          }
        } else {
          t.compile();
        }
      },
      error: function () {
        $("#epX").html(`<p>${e.textError || "Error"}</p>`);
      },
    });
  },
  run: function () {
    if (typeof jQuery == "function") {
      this.config.cat = $("#epX").data("label") || !1;
      if (this.config.cat == 0 || this.config.cat == this.config.labelMain) {
        this.config.labelMain = this.config.cat;
      }
      this.xhr();
    } else {
      console.log("jquery not found");
    }
  },
  search: function (t) {
    let e = $(t).val().toUpperCase(),
      a = $("#epX .clstyle").find("li");
    $.each(a, function (t, a) {
      $(a)
        .data("numb")
        .toString()
        .toUpperCase()
        .indexOf(e) > -1
        ? $(a).show()
        : $(a).hide();
    });
  },
};

const npX2 = {
  arr: new Array,
  config: {
    max: 150,
    start: 1,
    labelMain: "Series"
  },
  sort: e => e.sort((e, t) => e.title.localeCompare(t.title, void 0, { numeric: !0 })),
  compile: function () {
    let e = this.sort(this.arr).reverse(),
      t = this.config,
      a = (window || document).location.pathname,
      r = $('<select id="nPL_select" onchange="this.options[this.selectedIndex].value&&window.open(this.options[this.selectedIndex].value, \'_self\')" name="nPL_list"></select>'),
      n = "",
      i = "",
      l = "";

    const settingBtn = $('<button class="red-button" id="open-option" onclick="openSettings()"><i class="fas fa-cog mt-5"></i>الإعدادات</button>');

    const linkElement = $("#link");
    const downloadBtn = linkElement.length > 0 ? $('<button class="red-button" id="dl"><i class="fas fa-download mt-5"></i>تحميل</button>') : null;
    if (downloadBtn) {
      downloadBtn.click(() => {
        window.open(linkElement.attr("href"), "_blank");
      });
    }

$.each(e, (o, s) => {
  s.url.includes(a) &&
    (e[o + 1] &&
      (!s.cat.includes('Series') && !e[o + 1].cat.includes('Series') ?
        (i = $(`<a rel="prev" href="${e[o + 1].url}"><i class="fa fa-arrow-right"></i>${t.prev||" السابق"}</a>`)) : ""
      ),
      e[o - 1] &&
      (!s.cat.includes('Series') && !e[o - 1].cat.includes('Series') ?
        (l = $(`<a rel="next" href="${e[o - 1].url}">${t.next||"التالي "}<i class="fas fa-arrow-left"></i></a>`)) : ""
      )
    );
});


$.each(e, (o, s) => {
  const postNumber = s.title.match(/\d+/);
  const optionText = postNumber ? `الفصل ${postNumber[0]}` : s.title;
  s.cat.some(e => t.labelMain == e) ? n = $(`<a rel="home" href="${s.url}"><i class="fas fas fa-home"></i>${t.home||" الفصول"}</a>`) :
    (r.append($(`<option ${s.url.includes(a) ? 'selected="selected"' : ""} value="${s.url}">${optionText}</option>`)));
});



    let o = $('<div class="inner_nPL"></div>');
    o.append(settingBtn);
    if (downloadBtn) {
      o.append(downloadBtn);
    }
    o.append(i).append(n).append(l);

  const contSDS = $('<div class="contSDS"></div>');
    contSDS.append(settingBtn).append(downloadBtn).append(r);

    $("#nPL").html(contSDS).append(o);
  },
  jqCheck: () => "function" == typeof jQuery,
  xhr: function () {
    const e = this,
      t = e.config;
    $.ajax({
      type: "get",
      url: `${t.site||""}/feeds/posts/summary/-/${t.cat}`,
      data: { alt: "json", "start-index": t.start, "max-results": t.max },
      dataType: "jsonp",
      success: a => {
        "entry" in a.feed ?
          ($.each(a.feed.entry, (t, a) => {
            e.arr.push({ title: a.title.$t, url: a.link.find(e => "alternate" == e.rel).href, cat: a.category.map(e => e.term) });
          }),
            a.feed.entry.length >= t.max ?
              (e.config.start += e.config.max, e.xhr()) :
              e.compile()
          ) : 0 != e.arr.length && e.compile();
      },
      error: () => {
        $("#nPL").html(`<p>${t.textError||"Error"}</p>`);
      }
    });
  },
  run: function () {
    return this.jqCheck() ? 0 == $("#nPL").length ? "element tidak ada" : (this.config.cat = $("#nPL").data("label") || !1, 0 == this.config.cat ? "Category Tidak ada" : void this.xhr()) : "jquery tidak ada";
  }
};
npX2.run();
npX2.run();const npX = {
  arr: new Array,
  config: {
    max: 150,
    start: 1,
    labelMain: "Series"
  },
  sort: e => e.sort((e, t) => e.title.localeCompare(t.title, void 0, { numeric: !0 })),
  compile: function () {
    let e = this.sort(this.arr).reverse(),
      t = this.config,
      a = (window || document).location.pathname,
      r = $('<select id="nPL_select" onchange="this.options[this.selectedIndex].value&&window.open(this.options[this.selectedIndex].value, \'_self\')" name="nPL_list"></select>'),
      n = "",
      i = "",
      l = "";
    const settingBtn = $('<button id="showButton" onclick="showFloatingDiv()"><i class="fas fa-comment-alt mt-5"></i>التعليقات</button>');

    const linkElement = $("#link");
    const downloadBtn = null;
$.each(e, (o, s) => {
  s.url.includes(a) &&
    (e[o + 1] &&
      (!s.cat.includes('Series') && !e[o + 1].cat.includes('Series') ?
        (i = $(`<a rel="prev" href="${e[o + 1].url}"><i class="fa fa-arrow-right"></i>${t.prev||" السابق"}</a>`)) : ""
      ),
      e[o - 1] &&
      (!s.cat.includes('Series') && !e[o - 1].cat.includes('Series') ?
        (l = $(`<a rel="next" href="${e[o - 1].url}">${t.next||"التالي "}<i class="fas fa-arrow-left"></i></a>`)) : ""
      )
    );
});


$.each(e, (o, s) => {
  const postNumber = s.title.match(/\d+/);
  const optionText = postNumber ? `الفصل ${postNumber[0]}` : s.title;
  s.cat.some(e => t.labelMain == e) ? n = $(`<a rel="home" href="${s.url}"><i class="fas fas fa-home"></i>${t.home||" الفصول"}</a>`) :
    (r.append($(`<option ${s.url.includes(a) ? 'selected="selected"' : ""} value="${s.url}">${optionText}</option>`)));
});



    let o = $('<div class="inner_nPL"></div>');
    o.append(settingBtn);
    if (downloadBtn) {
      o.append(downloadBtn);
    }
    o.append(i).append(n).append(l);

  const contSDS = $('<div class="contSDS"></div>');
    contSDS.append(settingBtn).append(downloadBtn).append(r);

    $("#nPL2").html(contSDS).append(o);
  },
  jqCheck: () => "function" == typeof jQuery,
  xhr: function () {
    const e = this,
      t = e.config;
    $.ajax({
      type: "get",
      url: `${t.site||""}/feeds/posts/summary/-/${t.cat}`,
      data: { alt: "json", "start-index": t.start, "max-results": t.max },
      dataType: "jsonp",
      success: a => {
        "entry" in a.feed ?
          ($.each(a.feed.entry, (t, a) => {
            e.arr.push({ title: a.title.$t, url: a.link.find(e => "alternate" == e.rel).href, cat: a.category.map(e => e.term) });
          }),
            a.feed.entry.length >= t.max ?
              (e.config.start += e.config.max, e.xhr()) :
              e.compile()
          ) : 0 != e.arr.length && e.compile();
      },
      error: () => {
        $("#nPL2").html(`<p>${t.textError||"Error"}</p>`);
      }
    });
  },
  run: function () {
    return this.jqCheck() ? 0 == $("#nPL2").length ? "element tidak ada" : (this.config.cat = $("#nPL2").data("label") || !1, 0 == this.config.cat ? "Category Tidak ada" : void this.xhr()) : "jquery tidak ada";
  }
};
npX.run();
