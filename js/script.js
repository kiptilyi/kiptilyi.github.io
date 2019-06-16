function liveDrawing(inputId) {
    'use sctrict'
    const input = document.getElementById(`${inputId}`);
    // const modal = document.getElementById("drawing-app");
    const modal = document.createElement("div");
    modal.innerHTML = `<div class="modal-dialog modal-full" role="document"><div class="modal-content"><div class="modal-header"><a id="downloadlink" download="test">Download</a><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"></div></div></div>`;
    const modalInst = new Modal(modal);
    const mBody = modal.querySelector(".modal-body");
    const canvasFullSize = document.createElement("canvas");
    const ctxFullSize = canvasFullSize.getContext("2d");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const clickDrag = new Array();
    let imgHD;
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
        uploadPhoto(input).then(src => createImgs(src).then(() => modalInst.show()), bad => alert(bad));
    });

    $(modal).on("shown.bs.modal", function (e) {
        resizeCanvas(imgHD, canvas);

        redraw();

        mBody.appendChild(canvas);

        document.getElementById("downloadlink").addEventListener("touchstart", function (e) {
            convertToFullSize(canvas, ctx, imgDraw, canvasFullSize, ctxFullSize, imgHD).then((a) => {
                console.log(a);
                e.target.setAttribute("href", a);
            });
        });

    });

    window.onresize = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            resizeCanvas(imgHD, canvas);
            redraw();
        }, 50);
    }

    function convertToFullSize(canvasDraw, ctxDraw, ImgDraw, canvasFullSize, ctxFullSize, imgHD) {

        return new Promise(function (resolve) {

            let mainRatio = (canvasFullSize.width * canvasFullSize.height) / (canvasDraw.width * canvasDraw.height);

            console.log(mainRatio);

            canvasFullSize.width = canvasDraw.width * mainRatio;
            canvasFullSize.height = canvasDraw.height * mainRatio;

            ctxFullSize.drawImage(imgHD, 0, 0, canvasFullSize.width, canvasFullSize.height);


            let fullSizeClickX = new Array();
            let fullSizeClickY = new Array();

            ctxFullSize.strokeStyle = ctx.strokeStyle;
            ctxFullSize.lineJoin = ctx.lineJoin;
            ctxFullSize.lineWidth = ctx.lineWidth * mainRatio;

            if (clickX.length && clickY.length) {
                fullSizeClickX = clickX.map((el) => (el * canvasFullSize.width) / canvasDraw.width);
                fullSizeClickY = clickY.map((el) => (el * canvasFullSize.height) / canvasDraw.height);
            }

            imgDraw.width = canvas.width;
            imgDraw.height = canvas.height;


            for (var i = 0; i < fullSizeClickX.length; i++) {

                ctxFullSize.beginPath();

                if (clickDrag[i] && i) ctxFullSize.moveTo(fullSizeClickX[i - 1], fullSizeClickY[i - 1]);
                else ctxFullSize.moveTo(fullSizeClickX[i] - 1, fullSizeClickY[i]);

                ctxFullSize.lineTo(fullSizeClickX[i], fullSizeClickY[i]);
                ctxFullSize.closePath();
                ctxFullSize.stroke();

            }

            resolve(canvasFullSize.toDataURL("image/jpeg"));
            // console.log(ctxFullSize.height);
            // console.log(canvasFullSize.width);
        });

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

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let width = img.width;
        let height = img.height;

        if (width > height && width > 1920) {
            height = height / (width / 1920);
            width = 1920;
        } else if (height > width && height > 1920) {
            width = width / (height / 1920);
            height = 1920;
        }

        canvasFullSize.width = width;
        canvasFullSize.height = height;

        if ([5, 6, 7, 8].indexOf(data.Orientation) != -1) {
            canvas.width = height;
            canvas.height = width;
        } else {
            canvas.width = width;
            canvas.height = height;
        }

        switch (data.Orientation) {
            case 2:
                ctx.transform(-1, 0, 0, 1, width, 0);
                break;
            case 3:
                ctx.transform(-1, 0, 0, -1, width, height);
                break;
            case 4:
                ctx.transform(1, 0, 0, -1, 0, height);
                break;
            case 5:
                ctx.transform(0, 1, 1, 0, 0, 0);
                break;
            case 6:
                ctx.transform(0, 1, -1, 0, height, 0);
                break;
            case 7:
                ctx.transform(0, -1, -1, 0, height, width);
                break;
            case 8:
                ctx.transform(0, -1, 1, 0, 0, width);
                break;
            default:
                return img.src;
        }

        ctx.drawImage(img, 0, 0, width, height);

        return canvas.toDataURL("image/jpeg");

    }

    function uploadPhoto(input) {

        return new Promise(function (resolve, reject) {
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

    }

    function createImgs(src) {
        return new Promise(function (resolve) {
            imgHD = new Image();
            imgDraw = new Image();
            imgHD.src = src[0];
                EXIF.getData(src[1], function() {
                    imgData = EXIF.getAllTags(this);
                    imgHD.src = fixImgRotate(imgHD, imgData);
                    imgHD.onload = e => {
                        imgDraw = imgHD;
                        resolve();
                    }
                });

        });
    }

    ////

    canvas.addEventListener("touchstart", function (e) {
        let mouseX = e.touches[0].pageX - this.offsetLeft;
        let mouseY = e.touches[0].pageY - this.offsetTop;

        paint = true;
        addClick(e.touches[0].pageX - this.offsetLeft, e.touches[0].pageY - this.offsetTop);
        redraw();
    });

    canvas.addEventListener("touchmove", function (e) {
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

        for (var i = 0; i < clickX.length; i++) {

            ctx.beginPath();

            if (clickDrag[i] && i) ctx.moveTo(clickX[i - 1], clickY[i - 1]);
            else ctx.moveTo(clickX[i] - 1, clickY[i]);

            ctx.lineTo(clickX[i], clickY[i]);
            ctx.closePath();
            ctx.stroke();

        }

    }

}


liveDrawing("takePhoto");

