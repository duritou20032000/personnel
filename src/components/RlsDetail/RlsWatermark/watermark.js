;(function(win, doc){
    var pluginName = 'watermark',
        defaults = {
            path: 'code.png',
            dataPath: false,
            //内容
            text_default: '默认水印测试',           //系统默认内容
            text_defined:'',           //自定义文本
            text_date:'',           //日期
            //文字字符串宽度
            textWidth_default: 13,
            textWidth_defined: 13,
            textWidth_date: 13,
            //字大小
            textSize_default: 20,
            textSize_defined: 13,
            textSize_date: 13,
            //颜色
            textColor_default: 'white',
            textColor_defined: 'white',
            textColor_date: 'white',
            //字背景颜色
            textBg: 'rgba(0, 0, 0, 0.0)',
            //字体
            fontFamily_default: '宋体',
            fontFamily_defined: '宋体',
            fontFamily_date: '宋体',
            default:1,
            //默认平铺水印间距
            space:10,

            //字或者图片在图片中的x,y坐标
            left_default:0,
            top_default:0,
            left_defined:0,
            top_defined:0,
            left_date:0,
            top_date:0,
            left_image:0,
            top_image:0,
            //透明度
            opacity_default: 0.7,
            opacity_defined: 0.7,
            opacity_date: 0.7,
            opacity_image: 0.7,
            margin: 0,
            //是否将水印覆盖整个图片
            fullOverlay: false,
            //字体偏转弧度
            radian:0,
            //输出图片尺寸
            outputWidth: 'auto',
            outputHeight: 'auto',
            outputType: 'jpeg', // jpeg | png | webp
            //水印的宽度（高度自适应）
            imgSize:30,
            //是否显示全部水印
            showall:true,

            done: function (imgURL) {
                this.src = imgURL;
            },
            fail: function ( /*imgURL*/ ) {
                // console.error(imgURL, 'image error!');
            },
            always: function ( /*imgURL*/ ) {
                // console.log(imgURL, 'image URL!');
            }
        };

    var watermark = function(element, options, mainResolve){

        this.element = element;
        this.settings = Object.assign({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.mainResolve = mainResolve;
        this.init();
    }

    watermark.prototype = {
        constructor:watermark,
        init: function () {

            var _this = this,
                ele = _this.element,
                set = _this.settings,
                actualPath = set.dataPath ? ele.dataset[set.dataPath] : set.path,

                wmData = {
                    imgurl: actualPath,
                    type: 'png',
                    cross: true
                },

                imageData = {
                    imgurl: ele.src,
                    cross: true,
                    type: set.outputType,
                    width: set.outputWidth,
                    height: set.outputHeight
                };

            // Watermark dạng base64
            if (actualPath.search(/data:image\/(png|jpg|jpeg|gif);base64,/) === 0) {
                wmData.cross = false;
            }

            // Ảnh đang duyệt dạng base64
            if (ele.src.search(/data:image\/(png|jpg|jpeg|gif);base64,/) === 0) {
                imageData.cross = false;
            }

            if (set.text_default !== '') {
                wmData.imgurl = _this.textwatermark('default');
                wmData.cross = false;
            }

            var pro = new Promise(function(resolve,reject){

                _this.imgurltodata(wmData, function (imgObj) {
                    resolve(imgObj);
                });
            })

            pro.then(function(imgObj){

                imageData.wmObj = imgObj;
                _this.imgurltodata(imageData, function (dataURL) {
                    set.done.call(ele, dataURL);
                    set.always.call(ele, dataURL);
                });
            })

        },

        /**
         * 默认背景watermark
         * @returns {String} URL ảnh dạng base64
         */
        textwatermark: function (suffix) {
            var _this = this,
                set = _this.settings,

                canvas = document.createElement('CANVAS'),
                ctx = canvas.getContext('2d'),

                w = set['textWidth_'+ suffix],
                h = parseInt(set['textSize_' + suffix]) + 8,

                radian = set.radian * Math.PI/180,

                cw = Math.abs(w * Math.cos(radian)) + Math.abs(h * Math.sin(radian)),
                ch = Math.abs(w * Math.sin(radian)) + Math.abs(h * Math.cos(radian)),
                tx = h * Math.sin(radian),
                ty = w * Math.sin(radian);

            if(w == 13){
                //如果是默认值，根据字数量自适应
                w = set['text_'+ suffix].length * parseInt(set['textSize_' + suffix]);
                cw = Math.abs(w * Math.cos(radian)) + Math.abs(h * Math.sin(radian));
                ch = Math.abs(w * Math.sin(radian)) + Math.abs(h * Math.cos(radian));
                tx = h * Math.sin(radian);
                ty = w * Math.sin(radian);
            }

            canvas.width = cw;
            canvas.height = ch;

            if(set.radian>0){
                //修正字体越出边界问题
                ctx.translate(tx,0);
            }else{
                ctx.translate(0,Math.abs(ty));
            }

            var op = set['opacity_' + suffix];
            if (op >= 0 && op <= 1) {
                ctx.globalAlpha = op;
            }

            ctx.rotate(set.radian * Math.PI/180);

            ctx.fillStyle = set.textBg;
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = set['textColor_' + suffix];
            ctx.textAlign = 'center';
            ctx.font = set['textSize_' + suffix] + 'px ' + set['fontFamily_' + suffix];

            ctx.fillText(set['text_'+ suffix], (w / 2), (parseInt(set['textSize_' + suffix]) + 2));

            return canvas.toDataURL();
        },
        /**
         * 单个文本的水印
         */
        singletextwatermark: function (ctx,suffix,cw,ch) {
            var _this = this,
                set = _this.settings,

                w = set['textWidth_'+ suffix],
                h = parseInt(set['textSize_' + suffix]) + 8,
                l = parseFloat(set['left_'+ suffix]),
                t = parseFloat(set['top_'+ suffix]);

            if(w == 13){
                //如果是默认值，根据字数量自适应
                w = set['text_'+ suffix].length * parseInt(set['textSize_' + suffix]);
            }

            if(t == 0){
                if(suffix=='defined'){
                    //如果是自定义字体，默认居中显示
                    t = ch/2 ;
                }else if(suffix=='date'){
                    //如果是日期，默认居下显示
                    t = ch*9/10 ;
                }
            }

            if(l == 0){
                if(suffix=='defined'){
                    //如果是自定义字体，默认居中显示
                    l = cw/2;
                }else if(suffix=='date'){
                    //如果是日期，默认居下显示
                    l = (cw + w)/8;
                }
            }
            ctx.fillStyle = set.textBg;
            ctx.fillRect(l-w/2, t-h*5/6, w, h);

            var op = set['opacity_' + suffix];
            if (op >= 0 && op <= 1) {
                ctx.globalAlpha = op;
            }

            ctx.fillStyle = set['textColor_' + suffix];
            ctx.textAlign = 'left';
            ctx.font = set['textSize_' + suffix] + 'px ' + set['fontFamily_' + suffix];

            ctx.fillText(set['text_'+ suffix], l, t);

        },

        /**
         * 单个二维码的水印
         */
        singlecodewatermark: function (ctx,suffix,cw,ch,resolve) {
            var _this = this,
                set = _this.settings,

                w = 50,
                h = 50,
                l = set['left_'+ suffix],
                t = set['top_'+ suffix];

            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = set.path;
            img.onload = function(){
                //处理如果设置imgSize的时候根据比例调整图片大小
                var wmW = this.width,wmH = this.height;
                if(set.imgSize){
                    var scale = wmW/wmH;
                    w = set.imgSize;
                    h = w/scale;
                }

                if(t == 0){
                    t = ch - h - 10;
                }

                if(l == 0){
                    l = cw - w - 10;
                }

                var op = set['opacity_' + suffix];
                if (op >= 0 && op <= 1) {
                    ctx.globalAlpha = op;
                }

                ctx.drawImage(img, l,t, w, h);
                resolve();
            }

        },
        /**
         * Chuyển ảnh sang dạng base64
         * @param   {Object}  data     Các thông số thiết lập để phân biệt loại ảnh và với watermark
         * @param   {String}  callback URL ảnh dạng base64
         */
        imgurltodata: function (data, callback) {

            var _this = this,
                set = _this.settings,
                ele = _this.element,
                mainResolve = _this.mainResolve;

            var img = new Image();

            if (data.cross) {
                img.crossOrigin = 'Anonymous';
            }

            img.onload = function () {
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');

                var w = this.width, // image height
                    h = this.height, // image width
                    ctxH;

                if (data.wmObj) {

                    if (data.width !== 'auto' && data.height === 'auto' && data.width < w) {
                        h = h / w * data.width;
                        w = data.width;
                    } else if (data.width === 'auto' && data.height !== 'auto' && data.height < h) {
                        w = w / h * data.height;
                        h = data.height;
                    } else if (data.width !== 'auto' && data.height !== 'auto' && data.width < w && data.height < h) {
                        w = data.width;
                        h = data.height;
                    }

                }

                canvas.width = w;
                canvas.height = h;

                // Tô nền trắng cho ảnh xuất ra dạng jpeg
                if (data.type === 'jpeg') {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, w, h);
                }

                ctx.drawImage(this, 0, 0, w, h);

                // 生成 watermark 图片
                if (data.wmObj) {

                    // Vị trí chèn, gọi theo hướng trên bản đồ
                    var wmW = set.fullOverlay ? w : data.wmObj.width,
                        wmH = set.fullOverlay ? h : data.wmObj.height,
                        pos = set.margin,
                        gLeft, gTop;


                    var tmpLeft = set.left_default,
                        tmpTop = set.top_default,
                        numW = Math.ceil(w/wmW),
                        numH = Math.ceil(h/wmH);

                    if(typeof(tmpLeft)=="string"){
                        tmpLeft = parseInt(tmpLeft);
                    }

                    if(typeof(tmpTop)=="string"){
                        tmpTop = parseInt(tmpTop);
                    }

                    for(var i=0;i<numW;i++){
                        for(var j=0;j<numH;j++){
                            ctx.drawImage(data.wmObj, tmpLeft + wmW*i+i*set.space,tmpTop + wmH*j+j*set.space, wmW, wmH);
                        }
                    }

                    var p = new Promise(function(resolve,reject){

                        if(set.showall){
                            _this.singletextwatermark(ctx,'defined',w,h);
                            _this.singletextwatermark(ctx,'date',w,h);
                            _this.singlecodewatermark(ctx,'image',w,h,resolve);
                        }else{
                            resolve();
                        }
                    });

                    p.then(function(){
                        var dataURL = canvas.toDataURL('image/' + data.type);

                        if (typeof callback === 'function') {

                            if (data.wmObj) { // Đã có watermark
                                callback(dataURL);

                            } else { // watermark
                                var wmNew = new Image();
                                if (data.cross) {
                                    wmNew.crossOrigin = 'Anonymous';
                                }
                                wmNew.src = dataURL;
                                callback(wmNew);
                            }
                        }

                        if(typeof mainResolve == 'function'){
                            //处理完成后告知外部方法
                            mainResolve();
                        }
                        canvas = null;
                    })

                }else{

                    // 获取图片 base64
                    var dataURL = canvas.toDataURL('image/' + data.type);

                    if (typeof callback === 'function') {

                        if (data.wmObj) { // Đã có watermark
                            callback(dataURL);

                        } else { // watermark
                            var wmNew = new Image();
                            if (data.cross) {
                                wmNew.crossOrigin = 'Anonymous';
                            }
                            wmNew.src = dataURL;
                            callback(wmNew);
                        }
                    }

                    canvas = null;
                }
            };

            // Xử lý ảnh tải lỗi hoặc có thể do từ chối CORS headers
            img.onerror = function () {
                set.fail.call(this, this.src);
                set.always.call(ele, this.src);
                return false;
            };

            img.src = data.imgurl;
        }
    }

    win.watermark = watermark;
})(window, document);
