$.Redactor.prototype.medialibrary=function(){return{init:function(){var i=this.button.add("medialibrary","MediaLibrary");this.button.addCallback(i,this.medialibrary.addMedialibrary),this.button.setIcon(i,'<i class="material-icons">photo_library</i>'),$(document).on("reload.qor.bottomsheets",".qor-bottomsheets__mediabox",this.medialibrary.initItem)},addMedialibrary:function(){var i,e=this.$element,t={selectModal:"mediabox",maxItem:"1"},a=e.data().redactorSettings.medialibraryUrl;this.medialibrary.BottomSheets=i=$("body").data("qor.bottomsheets"),t.url=a,i.open(t,this.medialibrary.handleMediaLibrary)},handleMediaLibrary:function(){var i=$(".qor-bottomsheets"),e={onSelect:this.medialibrary.selectResults,onSubmit:this.medialibrary.submitResults};i.qorSelectCore(e).addClass("qor-bottomsheets__mediabox"),this.medialibrary.initItem()},initItem:function(){var i,e,t=$(".qor-bottomsheets").find("tbody tr");t.each(function(){i=$(this),e=i.find(".qor-table--ml-slideout p img").first(),i.find(".qor-table__actions").remove(),e.length&&(i.find(".qor-table--medialibrary-item").css("background-image","url("+e.prop("src")+")"),e.parent().hide())})},selectResults:function(i){this.medialibrary.handleResults(i)},submitResults:function(i){this.medialibrary.handleResults(i,!0)},handleResults:function(i,e){e?"video_link"==i.SelectedType||JSON.parse(i.MediaOption).URL.match(this.medialibrary.reVideo)?this.medialibrary.insertVideoCode(i,!0):this.medialibrary.insertImages(i,!0):i.isExternalVideo||i.isUploadedVideo?this.medialibrary.insertVideoCode(i):this.medialibrary.insertImages(i),this.medialibrary.BottomSheets.hide()},insertVideoCode:function(i,e){this.opts.mediaContainerClass="undefined"==typeof this.opts.mediaContainerClass?"qor-video-container":this.opts.mediaContainerClass;var t,a,r,o,s=this.opts.mediaContainerClass,d="video_link"==i.SelectedType,n=this.opts.regexps.linkyoutube,l=this.opts.regexps.linkvimeo,m=/\.mp4$|\.m4p$|\.m4v$|\.m4v$|\.mov$|\.mpeg$|\.webm$|\.avi$|\.ogg$|\.ogv$/,c=(Math.random()+1).toString(36).substring(7),h='<figure class="'+s+'"><iframe style="width: 100%; height: 380px;" src="',b='" frameborder="0" allowfullscreen></iframe><figcaption>'+i.MediaOption.Description+"</figcaption></figure>";e&&(i.MediaOption=JSON.parse(i.MediaOption)),r=i.MediaOption,d?(a=r.Video,a.match(n)&&(t=a.replace(n,h+"//www.youtube.com/embed/$1"+b)),a.match(l)&&(t=a.replace(l,h+"//player.vimeo.com/video/$2"+b))):r.URL.match(m)&&(t='<figure class="'+s+'"><div role="application"><video width="100%" height="380px" controls="controls" aria-describedby="qor-video-'+c+'" tabindex="0"><source src="'+r.URL+'"></video></div><figcaption id="qor-video-'+c+'">'+r.Description+"</figcaption></figure>"),o=this.selection.$currentTag,o&&o.after(t),this.code.sync()},insertImages:function(i){var e,t,a=$("<img>"),r=$("<"+this.opts.imageTag+">"),o=i.MediaOption;e=o.URL.replace(/image\..+\./,"image."),a.attr({src:e,alt:o.Description}),r.append(a),t=this.selection.$currentTag,t&&t.after(r),this.image.setEditable(a),this.code.sync()}}};