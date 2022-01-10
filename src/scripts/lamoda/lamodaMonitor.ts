import { store } from "../../store"
import { Lamoda } from "./lamoda"

const request = require('cloudscraper')


const getProxy = (proxyProfile:string):string[]=>store.getState().proxy[proxyProfile].proxy

const changeProxy = ()=>{
    let i = 0
    return (proxyProfile:string)=>{
        const proxy = getProxy(proxyProfile||"noProxy")
        i > proxy.length ? i = 0 : i++
        return proxy[i % proxy.length] || ''
    }
}
const Change = changeProxy()
export class LamodaMonitor{
    private _pids:string[] = []
    private _proxyProfile:string = 'noProxy'
    private _timeOut:number = 0
    private _ITEMS:{
        [sku:string]:any
    }={}
    constructor (){
        this.Monitor()
    }
    set setProxyProfile(proxyProfile:string){
        this._proxyProfile = proxyProfile
    }
    set setTimeout(timeout:number){
        this._timeOut = timeout
    }
    set setPids (pids:string[]){
        this._pids = [...new Set([...this._pids,...pids])]
    }
    set removePids (pids:string[]){
        this._pids = this._pids.filter(pid=>!pids.includes(pid))
    }
    get getPids(){
        return this._pids
    }
    set deletePids(pids:string[]){
        this._pids = this._pids.filter(pid=>!pids.includes(pid))
    }
    public async Monitor():Promise<ReturnType<typeof setTimeout>|undefined>{
        try {
            const timeA = Date.now()
            const pool = []
            pool.push(this._Parse())
            await Promise.all(pool)
            console.log('Items: ' + Object.keys(this._ITEMS).length, Date.now() - timeA);
            for (let item in this._ITEMS) {
                if (this._ITEMS[item].available) {
                    for (let size in this._ITEMS[item].sizes) {
                        /* sizeCheck */
                        // if (/* !OldData[item].sizes.map(size => size.size).includes(this._ITEMS[item].sizes[size].size) */) {
                        //     console.log('restock');
                        //     Lamoda
                        // }
                    }
                }
    
            }    
        } catch (error) {
            console.log(error)
            return setTimeout(()=>this.Monitor(),this._timeOut)
        }
        return setTimeout(()=>this.Monitor(),this._timeOut)
    }
    private async _Parse(){
        let data = await request.get(`https://api.lamoda.ru/mobile/v1/products/get?skus=${this._pids.join(',')}`/* &device_id=2971ae9d-24fc-46a8-bc42-afe901024ddc&best_delivery=true` */, {
            headers:{
                "X-Lm-Country": "ru",
                "X-Lm-Lid": "ZEADoWFPhBt3CmA1C7R5AgA=",
                "X-Lm-Platform": "android_phone",
                "X-Lm-Sessionkey": "ZTE5ZjgzNWE0NGUwNGQ2OGE5NWUzNmJlOWYwM2Y3OGE=|1632603394|b2c9a8aa823bcc164b561cf436e8f5eae1fa9aa6",
                "X-Lm-Sessionsignature": "1f22b45fb2492445990282ff053cb6c4b51f3d3d",
                "X-Newrelic-Id": "UwYOVl5aGwAHVlNUBQA="
            },
            proxy: Change(this._proxyProfile) || '',
            json: true,
            timeout: 2000
        })/* .querySelector('div.grid__product') */
        for (let item of data.products) {
            let price = item.price
            let sizes = item.sizes.map((size: { title: string; stock_quantity: number; sku: string }) => {
                return {
                    size: size.title,
                    stock: size.stock_quantity,
                    sku:size.sku
                }
            }).filter((size: { stock: number }) => size.stock)
            let sku = item.sku
            let url = `https://www.lamoda.ru/p/${sku}`
            let name = item.model_title
            let picture = `https://a.lmcdn.ru/pi/product${item.gallery[0]}`
            this._ITEMS = {
                ...this._ITEMS,
                [sku]: {
                    url,
                    price,
                    sizes,
                    name,
                    picture,
                    available: sizes.map((size:any) => size.stock).length ? !!sizes.map((size:any) => size.stock).reduce((p:number, c:number) => c + p) : false
                }
            }
        }
    }
}