function liveDrawing(inputId) {
    'use sctrict'
    const input = document.getElementById(`${inputId}`);
    const modal = document.createElement("div");
    modal.innerHTML = `<div class="modal-dialog modal-full" role="document"><div class="modal-content"><div class="modal-header"><a id="downloadlink" download="test">Download</a><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"></div></div></div>`;
    const modalInst = new Modal(modal);
    const mBody = modal.querySelector(".modal-body");
    const canvasFullSize = document.createElement("canvas");
    const ctxFullSize = canvasFullSize.getContext("2d");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const clickDrag = new Array();
    let imgFullSize;
    let imgDraw;
    let clickX = new Array();
    let clickY = new Array();
    let timer;
    let imgData;
    ////
    modal.classList.add("modal", "fade");
    modal.id = "drawing-app";
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "exampleModalLabel");
    modal.setAttribute("aria-hidden", "true");
    ////
    input.setAttribute("accept", "image/*;capture=camera");
    input.setAttribute("type", "file");
    ////

    input.addEventListener("change", function () {
        uploadPhoto(input).then(src => createImgs(src), bad => alert(bad));
        modalInst.show();
    });

    $(modal).on("shown.bs.modal", function (e) {
        resizeCanvas(imgFullSize, canvas);

        redraw();
        mBody.appendChild(canvas);

        document.getElementById("downloadlink").addEventListener("touchstart", function (e) {
            convertToFullSize(canvas, ctx, imgDraw, canvasFullSize, ctxFullSize, imgFullSize).then((a) => {
                e.target.setAttribute("href", a);
            });
        });

    });

    window.onresize = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            resizeCanvas(imgFullSize, canvas);
            redraw();
        }, 50);
    }

    function convertToFullSize(canvasDraw, ctxDraw, ImgDraw, canvasFullSize, ctxFullSize, imgFullSize) {


        for (let i = 0; i < arguments.length; i++) {
            console.log(arguments[i]);
        }

        // console.log(canvasFullSize);

        let promise = new Promise(function (resolve) {


            let mainRatio = (canvasFullSize.width * canvasFullSize.height) / (canvasDraw.width * canvasDraw.height);

            canvasFullSize.width = canvas.width / mainRatio;
            canvasFullSize.height = canvas.height / mainRatio;

            ctxFullSize.drawImage(imgFullSize, 0, 0, canvasFullSize.width, canvasFullSize.height);



            let fullSizeClickX = new Array();
            let fullSizeClickY = new Array();

            ctxFullSize.strokeStyle = ctx.strokeStyle;
            ctxFullSize.lineJoin = ctx.lineJoin;
            ctxFullSize.lineWidth = ctx.lineWidth / mainRatio;

            if (clickX.length && clickY.length) {
                fullSizeClickX = clickX.map((el) => (el * canvasFullSize.width) / canvasDraw.width);
                fullSizeClickY = clickY.map((el) => (el * canvasFullSize.height) / canvasDraw.height);
            }

            imgDraw.width = canvas.width;
            imgDraw.height = canvas.height;



            for(var i=0; i < fullSizeClickX.length; i++) {

                ctxFullSize.beginPath();

                if(clickDrag[i] && i) ctxFullSize.moveTo(fullSizeClickX[i-1], fullSizeClickY[i-1]);
                else ctxFullSize.moveTo(fullSizeClickX[i]-1, fullSizeClickY[i]);

                ctxFullSize.lineTo(fullSizeClickX[i], fullSizeClickY[i]);
                ctxFullSize.closePath();
                ctxFullSize.stroke();

            }

            resolve(canvasFullSize.toDataURL("image/jpeg"));
            // console.log(ctxFullSize.height);
            // console.log(canvasFullSize.width);
        });


        return promise;
    }


    function resizeCanvas(img, canvas) {

        let oldCanvasW = canvas.width;
        let oldCanvasH = canvas.height;
        ////
        let imageAspectRatio = img.width / img.height;
        let mBodyAspectRatio = mBody.clientWidth / mBody.clientHeight;
        let renderableHeight, renderableWidth;

        if (imageAspectRatio < mBodyAspectRatio) {
            renderableHeight = mBody.clientHeight;
            renderableWidth = img.width * (renderableHeight / img.height);

        } else if (imageAspectRatio > mBodyAspectRatio) {
            renderableWidth = mBody.clientWidth;
            renderableHeight = img.height * (renderableWidth / img.width);
        } else {
            renderableHeight = mBody.clientHeight;
            renderableWidth = mBody.clientWidth;
        }

            canvas.width = renderableWidth;
            canvas.height = renderableHeight;

        if (clickX.length && clickY.length) {
            clickX = clickX.map((el) => (el * renderableWidth) / oldCanvasW);
            clickY = clickY.map((el) => (el * renderableHeight) / oldCanvasH);
        }

    }

    function fixImgRotate(img, data) {
        if (data.Orientation == 6) {
            const width = img.width;
            const height = img.height;
            const canvas = document.createElement('canvas');
            canvas.width = height;
            canvas.height = width;
            const ctx = canvas.getContext("2d");
            ctx.transform(0, 1, -1, 0, height , 0);

            ctx.drawImage(img, 0, 0, width, height);

            const fixedImg = new Image();
                fixedImg.src = canvas.toDataURL();

            return fixedImg;
        } else {
            return img;
        }

    }

    function uploadPhoto(input) {

        let promise = new Promise(function (resolve, reject) {
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                reader.onload = e => {
                    resolve([e.target.result, input.files[0]]);
                }
            } else {
                reject("Что-то пошло не так...");
            }
        });

        return promise;

    }

    function createImgs(src) {
        imgFullSize = new Image();
        imgDraw = new Image();
        imgFullSize.src = src[0];
        imgDraw.src = src[0];
        EXIF.getData(src[1], function() {
            imgData = EXIF.getAllTags(this)
            imgFullSize = fixImgRotate(imgFullSize, imgData);
            imgDraw = fixImgRotate(imgDraw, imgData);
        });
    }

    ////

    canvas.addEventListener("touchstart", function(e) {
        let mouseX = e.touches[0].pageX - this.offsetLeft;
        let mouseY = e.touches[0].pageY - this.offsetTop;

        paint = true;
        addClick(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop);
        redraw();
    });

    canvas.addEventListener("touchmove", function(e){
        if (paint) {
            addClick(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop, true);
            redraw();
        }
    });

    canvas.addEventListener("touchend", () => paint = false);

    canvas.addEventListener("touchleave", () => paint = false);

    function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
    }

    function redraw() {

        imgDraw.width = canvas.width;
        imgDraw.height = canvas.height;

        ctx.drawImage(imgDraw, 0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.strokeStyle = "#df4b26";
        ctx.lineJoin = "round";
        ctx.lineWidth = 5;

        for(var i=0; i < clickX.length; i++) {

            ctx.beginPath();

            if(clickDrag[i] && i) ctx.moveTo(clickX[i-1], clickY[i-1]);
                else ctx.moveTo(clickX[i]-1, clickY[i]);

            ctx.lineTo(clickX[i], clickY[i]);
            ctx.closePath();
            ctx.stroke();

        }

    }

}


liveDrawing("takePhoto");

