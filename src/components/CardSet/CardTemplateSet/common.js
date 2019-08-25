/**
 * 选单个组件时设置边框
 * @param id
 * @param flag
 * @param _this
 */
export function uiActive(id,flag,_this){

    let logo = _this.state.logo,
        code = _this.state.code,
        text = _this.state.text,
        border = "dashed 1px #0a76bd";

    //清空选中控件参数数组
    emptyPool(_this);

    //清空所有组件边框和设置相应组件边框
    logo = logo.filter(function(item){
        if(flag==1 && item.id == id){
            item.border = border;
        }else{
            item.border = "none";
        }
        return item;
    })

    code = code.filter(function(item){
        if(flag==2 && item.id == id){
            item.border = border;
        }else{
            item.border = "none";
        }
        return item;
    })

    text = text.filter(function(item){
        if(flag==3 && item.id == id){
            item.border = border;
        }else{
            item.border = "none";
        }
        return item;
    })

    _this.setState({
        logo:logo,
        code:code,
        text:text,
    })
}

/**
 *  鼠标滑动选取多个组件功能
 * @param event
 * @param _this
 */
export function uiselectablehelper(event,_this,flag){

    var   target = event.target,
        parTarget = target.parentElement,
        pageX = event.pageX,
        pageY = event.pageY,
        x = event.nativeEvent.offsetX + target.offsetLeft,
        y = event.nativeEvent.offsetY + target.offsetTop,
        tl = target.offsetLeft,
        tt = target.offsetTop;

    //设置当前编辑页和选项卡
    _this.setState({
        toggle:flag
    })

    document.onmousemove = function(event){

        //清空选中控件参数数组
        emptyPool(_this);

        event.preventDefault();
        var dw = event.pageX - pageX,
            dh = event.pageY - pageY,
            dl = x,
            dt = y;

        if(dw<0){
            //如果宽度小于0，重新计算左边距
            dl = dl + dw;
            dw = -dw;
        }

        if(dh<0){
            //如果高度小于0，重新计算距离顶部的距离
            dt = dt + dh;
            dh = -dh;
        }

        //计算被框的组件
        let rl = dl - tl,
            rt = dt - tt,
            logo = _this.state.logo,
            code = _this.state.code,
            text = _this.state.text,
            border = "dashed 1px #0a76bd";

        logo = logo.filter(function(item){

            //设置
            item = setMultiBorder(item,rl,dw,rt,dh,border,1,_this);

            return item;
        })

        code = code.filter(function(item){

            //设置
            item = setMultiBorder(item,rl,dw,rt,dh,border,2,_this);

            return item;
        })

        text = text.filter(function(item){

            //设置
            item = setMultiBorder(item,rl,dw,rt,dh,border,3,_this);

            return item;
        })


        _this.setState({
            logo:logo,
            code:code,
            text:text,
            selectable:{
                sx:dl,
                sy:dt,
                sw:dw,
                sh:dh,
                display:"block",
            }
        })

    }.bind(this);
    document.onmouseup = function(){
        document.onmousemove = null;
        document.onmouseup = null;

        _this.setState({
            selectable:{
                sx:0,
                sy:0,
                sw:0,
                sh:0,
                display:"none",
            }
        })
    }
}

/**
 * 设置选中多个组件时的边框，同时记录相关组件的参数
 * @param item
 * @param rl
 * @param dw
 * @param rt
 * @param dh
 * @param border
 * @param flag
 * @param _this
 * @returns {*}
 */
function setMultiBorder(item,rl,dw,rt,dh,border,flag,_this){
    let left = parseInt(item.left),
        top = parseInt(item.top),
        width = 0,
        height = 0;

    if(item.width){
        width = parseInt(item.width);
        height = parseInt(item.height);
    }else{
        //字符类需要计算
        height = parseInt(item.size);
        width = item.text.replace(/[^x00-xFF]/g,"**").length * height/2;
    }

    if(((left < rl && (left + width) > rl) ||
            (left > rl && left < (rl + dw))) &&
        ((top < rt && (top + height) > rt) ||
            (top > rt && top < (rt + dh))) &&
        item.reverse == _this.state.toggle){

        item.border = border;
        //添加将选中的控件保存到参数数组
        let pool = _this.state.pool;
        if(pool.filter(tmp => tmp.id == item.id && tmp.flag == flag).length==0){
            //没有记录就添加
            pool.push({
                id:item.id,
                left:left,
                top:top,
                width:width,
                height:height,
                flag:flag,
            })
        }


        _this.setState({
            pool:pool
        })
    }else{
        item.border = "none";
    }
    return item;
}

function emptyPool(_this){

    _this.setState({
        pool:[]
    })
}

export function alignLeft(_this){

    let pool = _this.state.pool;
    let leftmin = 99999;

    pool.filter(item=>{
        if(item.left<leftmin){
            leftmin = item.left;
        }
    });

    pool.filter(item=>{

        let type = ['logo','code','text'];

        let key = type[item.flag - 1];

        let data = _this.state[key];

        data = data.filter(tmp =>{
            if(tmp.id == item.id){
                tmp.left = leftmin + "px";
            }

            return tmp;
        })

        let json = {};
        json[key] = data;

        _this.setState(json)

    })
}

export function alignRight(_this){

    let pool = _this.state.pool;
    let rightmax = 0;

    pool.filter(item=>{
        if(item.left + item.width > rightmax){
            rightmax = item.left + item.width;
        }
    });

    pool.filter(item=>{

        let type = ['logo','code','text'],
            key = type[item.flag - 1],
            data = _this.state[key];


        data = data.filter(tmp =>{
            if(tmp.id == item.id){
                let left = rightmax - item.width;
                tmp.left = left + "px";
            }

            return tmp;
        })

        let json = {};
        json[key] = data;

        _this.setState(json)

    })
}

export function alignTop(_this){

    let pool = _this.state.pool;
    let topmin = 99999;

    pool.filter(item=>{
        if(item.top < topmin){
            topmin = item.top;
        }
    });

    pool.filter(item=>{

        let type = ['logo','code','text'],
            key = type[item.flag - 1],
            data = _this.state[key];

        data = data.filter(tmp =>{
            if(tmp.id == item.id){
                tmp.top = topmin + "px";
            }

            return tmp;
        })

        let json = {};
        json[key] = data;

        _this.setState(json)

    })
}

export function alignBottom(_this){

    let pool = _this.state.pool;
    let bottommax = 0;

    pool.filter(item=>{
        if(item.top + item.height > bottommax){
            bottommax = item.top + item.height;
        }
    });

    pool.filter(item=>{

        let type = ['logo','code','text'],
            key = type[item.flag - 1],
            data = _this.state[key];

        data = data.filter(tmp =>{
            if(tmp.id == item.id){
                let top = bottommax - item.height;
                tmp.top = top + "px";
            }

            return tmp;
        })

        let json = {};
        json[key] = data;

        _this.setState(json)

    })
}

export function alignCenter(_this){

    let pool = _this.state.pool;
    let bottommax = 0,topmin = 99999,diff = 0;

    pool.filter(item=>{
        if(item.top + item.height > bottommax){
            bottommax = item.top + item.height;
        }

        if(item.top < topmin){
            topmin = item.top;
        }
    });

    diff = topmin + (bottommax - topmin) / 2;

    pool.filter(item=>{

        let type = ['logo','code','text'],
            key = type[item.flag - 1],
            data = _this.state[key];

        data = data.filter(tmp =>{
            if(tmp.id == item.id){
                let top = diff - item.height / 2;
                tmp.top = top + "px";
            }

            return tmp;
        })

        let json = {};
        json[key] = data;

        _this.setState(json)

    })
}

export function alignMiddle(_this){

    let pool = _this.state.pool;
    let leftmin = 9999, rightmax = 0, diff = 0;

    pool.filter(item=>{
        if(item.left + item.width > rightmax){
            rightmax = item.left + item.width ;
        }

        if(item.left < leftmin){
            leftmin = item.left;
        }
    });

    diff = leftmin + (rightmax - leftmin) / 2;

    pool.filter(item=>{

        let type = ['logo','code','text'],
            key = type[item.flag - 1],
            data = _this.state[key];

        data = data.filter(tmp =>{
            if(tmp.id == item.id){
                let left = diff - item.width / 2;
                tmp.left = left + "px";
            }

            return tmp;
        })

        let json = {};
        json[key] = data;

        _this.setState(json)

    })
}

export function reverse(_this){
    //切换正反面
    if(_this.state.toggle==1){
        _this.setState({
            toggle:2
        })
    }else if(_this.state.toggle==2){
        _this.setState({
            toggle:1
        })
    }
}