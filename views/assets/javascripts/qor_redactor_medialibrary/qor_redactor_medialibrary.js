// Add media library button for redactor editor
// By Jason weng @theplant

 $.Redactor.prototype.medialibrary = function() {
    return {
        init: function () {
            var button = this.button.add('medialibrary', 'MediaLibrary');
            this.button.addCallback(button, this.medialibrary.addMedialibrary);
            this.button.setIcon(button, '<i class="material-icons">photo_library</i>');
            $(document).on('reload.qor.bottomsheets', '.qor-bottomsheets__mediabox', this.medialibrary.initItem);
        },

        addMedialibrary: function () {
            var $element = this.$element,
                data = {'selectModal': 'mediabox', 'maxItem': '1'},
                mediaboxUrl = $element.data().redactorSettings.medialibraryUrl,
                BottomSheets;

            this.medialibrary.BottomSheets = BottomSheets = $('body').data('qor.bottomsheets');
            data.url = mediaboxUrl;
            BottomSheets.open(data, this.medialibrary.handleMediaLibrary);
        },

        handleMediaLibrary: function () {
            var $bottomsheets = $('.qor-bottomsheets'),
                options = {
                    onSelect: this.medialibrary.selectResults,  // render selected item after click item lists
                    onSubmit: this.medialibrary.submitResults   // render new items after new item form submitted
                };

                $bottomsheets.qorSelectCore(options).addClass('qor-bottomsheets__mediabox');
                this.medialibrary.initItem();
        },

        initItem: function () {
            var $trs = $('.qor-bottomsheets').find('tbody tr'),
                $tr,
                $img;

            $trs.each(function () {
                $tr = $(this);
                $img = $tr.find('.qor-table--ml-slideout p img').first();
                $tr.find('.qor-table__actions').remove();
                if ($img.length) {
                    $tr.find('.qor-table--medialibrary-item').css('background-image', 'url(' + $img.prop('src') + ')');
                    $img.parent().hide();
                }
            });
        },

        selectResults: function (data) {
            this.medialibrary.handleResults(data);
        },

        submitResults: function (data) {
            this.medialibrary.handleResults(data, true);
        },

        handleResults: function (data, isNew) {
            if (isNew) {
                if (data.SelectedType == 'video_link' || JSON.parse(data.MediaOption).URL.match(this.medialibrary.reVideo)) {
                    this.medialibrary.insertVideoCode(data, true);
                } else {
                    this.medialibrary.insertImages(data, true);
                }
            } else {
                if (data.isExternalVideo || data.isUploadedVideo) {
                    this.medialibrary.insertVideoCode(data);
                } else {
                    this.medialibrary.insertImages(data);
                }
            }

            this.medialibrary.BottomSheets.hide();
        },

        insertVideoCode: function (data, isNew) {
            this.opts.mediaContainerClass = (typeof this.opts.mediaContainerClass === 'undefined') ? 'qor-video-container' : this.opts.mediaContainerClass;

            var htmlCode, videoLink, mediaOption, $currentTag,
                mediaContainerClass = this.opts.mediaContainerClass,
                isVideoLink = data.SelectedType == 'video_link',
                reUrlYoutube = this.opts.regexps.linkyoutube,
                reUrlVimeo = this.opts.regexps.linkvimeo,
                reVideo = /\.mp4$|\.m4p$|\.m4v$|\.m4v$|\.mov$|\.mpeg$|\.webm$|\.avi$|\.ogg$|\.ogv$/,
                randomID = (Math.random() + 1).toString(36).substring(7),

                iframeStart = '<figure class="' + mediaContainerClass + '"><iframe style="width: 100%; height: 380px;" src="',
                iframeEnd = '" frameborder="0" allowfullscreen></iframe><figcaption>' + data.MediaOption.Description + '</figcaption></figure>';

            isNew && (data.MediaOption = JSON.parse(data.MediaOption));
            mediaOption = data.MediaOption;

            if (isVideoLink) {
                videoLink = mediaOption.Video;

                if (videoLink.match(reUrlYoutube)) {
                    htmlCode = videoLink.replace(reUrlYoutube, iframeStart + '//www.youtube.com/embed/$1' + iframeEnd);
                }

                if (videoLink.match(reUrlVimeo)) {
                    htmlCode = videoLink.replace(reUrlVimeo, iframeStart + '//player.vimeo.com/video/$2' + iframeEnd);
                }

            } else if (mediaOption.URL.match(reVideo)) {
                htmlCode = '<figure class="' + mediaContainerClass + '"><div role="application"><video width="100%" height="380px" controls="controls" aria-describedby="qor-video-' + randomID + '" tabindex="0"><source src="' + mediaOption.URL + '"></video></div><figcaption id="qor-video-' + randomID + '">' + mediaOption.Description + '</figcaption></figure>';
            }

            $currentTag = this.selection.$currentTag;
            $currentTag && $currentTag.after(htmlCode);
            this.code.sync();
        },

        insertImages: function (data) {
            var src,
                $currentTag,
                $img = $('<img>'),
                $figure = $('<' + this.opts.imageTag + '>'),
                mediaOption = data.MediaOption;

            src = mediaOption.URL.replace(/image\..+\./, 'image.');

            $img.attr({
                'src': src,
                'alt': mediaOption.Description
            });
            $figure.append($img);

            $currentTag = this.selection.$currentTag;
            $currentTag && $currentTag.after($figure);
            this.image.setEditable($img);
            this.code.sync();
        }
    };
};