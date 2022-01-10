import { LamodaDeliveryTypeInfo } from "../../Interfaces/interfaces"
import { getSignature } from "./signature"
const request = require('cloudscraper')

// const checkInit = (target:any)=>{
//     if (!target.Sessionsignature ||
//         !target.SessionKey||
//         !target.Lid
//         ){
//             console.log(target)
//             target.Init()
//         }
// }

export class Lamoda {
    private Sessionsignature: string = ''
    private Sessionkey: string = ''
    private Lid: string = ''
    private delivery_method_code:string = ''
    private checkoutStartedTime:number = 0
    private _Customer:{
        phone:string
        email:string
        first_name:string
        last_name:string
    }={
        phone:'',
        email:'',
        first_name:'',
        last_name:''
    }
    private _Address:{
        region: string,
        region_aoid: string
        city: string,
        city_aoid: string
        street: string
        street_aoid:string
        house_number: string
        house_aoid: string
        apartment: string
    } = {
        region: "",
        region_aoid: "",
        city: "",
        city_aoid: "",
        street: "",
        house_number: "",
        apartment: "",
        street_aoid: '',
        house_aoid: ''
    }
    private _Stop:boolean = false
    set setStop(stop:boolean){
        this._Stop = stop
    }
    set setCustomer(customer:{
        phone?:string
        email?:string
        first_name?:string
        last_name?:string
    }){
        this._Customer = {
            ...this._Customer,
            ...customer
        }
    }
    set setAddress(address:{
        region: string,
        region_aoid: string
        city: string,
        city_aoid: string
        street: string
        street_aoid:string
        house_number: string
        house_aoid: string
        apartment: string
    }){
        this._Address = {
            ...this._Address,
            ...address
        }
    }

    constructor(){
    }
    public AddToCart = async (sku: string = "MP002XW0R3NAINL") => {
        await request.post("https://api.lamoda.ru/mobile/v1/cart/add", {
            body: {
                "sku":sku
            },
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "X-Lm-Country": "ru",
                "X-Lm-Lid": this.Lid,//||"ZEADoWFPhBt3CmA1C7R5AgA=",
                "X-Lm-Platform": "android_phone",
                "X-Lm-Sessionkey": this.Sessionkey,// || "ZTE5ZjgzNWE0NGUwNGQ2OGE5NWUzNmJlOWYwM2Y3OGE=|1632601281|236ed27030a225612eaf61fc74a1157fb26a1170",
                "X-Lm-Sessionsignature": this.Sessionsignature// || "1f22b45fb2492445990282ff053cb6c4b51f3d3d",
                //"X-Newrelic-Id": "UwYOVl5aGwAHVlNUBQA="
            },
            json:true
        }).then(console.log).catch(console.log)
    }
    public PreCart = async (sku:string = "MP002XW0R3NAINL")=>{
        await this.AddToCart(sku)/* make overload */
        await this.GetFullDelivery()/* edit! */
        await this.RemoveFromCart(sku)/* this interval id */
    }
    public RemoveFromCart = async (sku: string = "MP002XW0R3NAINL") => {
        await request.post("https://api.lamoda.ru/mobile/v1/cart/remove", {
            body: {
                "skus":[sku]
            },
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "X-Lm-Country": "ru",
                "X-Lm-Lid": this.Lid,//||"ZEADoWFPhBt3CmA1C7R5AgA=",
                "X-Lm-Platform": "android_phone",
                "X-Lm-Sessionkey": this.Sessionkey,// || "ZTE5ZjgzNWE0NGUwNGQ2OGE5NWUzNmJlOWYwM2Y3OGE=|1632601281|236ed27030a225612eaf61fc74a1157fb26a1170",
                "X-Lm-Sessionsignature": this.Sessionsignature// || "1f22b45fb2492445990282ff053cb6c4b51f3d3d",
                //"X-Newrelic-Id": "UwYOVl5aGwAHVlNUBQA="
            },
            json:true
        }).then(console.log).catch(console.log)
    }

    public Init = async (): Promise<{
        sessionKey:string,
        sessionSignature:string,
        lid:string
    }|{}> => {
        try {
            return await request.post("https://api.lamoda.ru/mobile/v1/app/init", {
                body: {
                    country:"ru"
                },
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json; charset=utf-8",
                    "X-Lm-Supportedfeatures": "marketplace;androidpay"
                },
                json:true
            }).then((response: {
                session: string,
                hex_lid: string,
                lid: string
            }) => {
                console.log(response)
                this.Sessionkey = response.session
                this.Lid = response.lid
                this.Sessionsignature = Lamoda.GenerateSignature(response.session)
                /* some script to generate sessionSignatureToken */
                return {
                    sessionKey:response.session,
                    sessionSignature:this.Sessionsignature,
                    lid:response.lid
                }
            })

        } catch (error) {
            console.log(error)
            return {}
        }
    }
    static GenerateSignature = (sessionKey: string): string => {
        return getSignature(sessionKey)
    }
    public Checkout = async (): Promise<void> => {
        const date = new Date()
        const currentDate = `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}T${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}+0000`
        const interval_id =  await this.GetDeliveryId()
        await request.post("https://api.lamoda.ru/mobile/v1/orders/create", {
            body: 
                {
                    "device_data": {
                        "app_version": "LamodaAppAndroid/353000",
                        "platform": "Android",
                        "platform_version": "8.0.0",
                        "device_type": "phone",
                        "device_info": "unknown vbox86p Custom Phone",
                        "screen_info": "768x1184@2",
                        "local_datetime": currentDate// "2021-09-25T21:01:57+0000"
                    },
                    "checkout_type": "full",
                    "subscribe": false,
                    "customer": {
                        "first_name": this._Customer.first_name,
                        "last_name": this._Customer.last_name,
                        "email": this._Customer.email,
                        "phone": this._Customer.phone
                    },
                    "address": {
                        "region": this._Address.region,
                        "region_aoid": this._Address.region_aoid,
                        "city": this._Address.city,
                        "city_aoid": this._Address.city_aoid,
                        "street": this._Address.street,
                        "house_number": this._Address.house_number,
                        "apartment": this._Address.apartment
                    },
                    "delivery": {
                        "type": "courier",
                        "service_level_code": "economy",
                        "delivery_method_code": this.delivery_method_code,/* GetFullDelivery */
                        "interval_id": interval_id/* GetDeliveryInfo */
                    },
                    "payment_methods": [
                        {
                            "cart_package_id": "1___1",/* const */
                            "payment_method_code": "BertelsmannCod"/* const */
                        }
                    ],
                    "customer_notes": "1",
                    "is_phone_verification_supported": true,
                    "location": "a.checkout_sub"
                },
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "X-Lm-Country": "ru",
                "X-Lm-Lid": this.Lid,
                "X-Lm-Platform": "android_phone",
                "X-Lm-Sessionkey": this.Sessionkey,
                "X-Lm-Sessionsignature": this.Sessionsignature,
                "X-Newrelic-Id": "UwYOVl5aGwAHVlNUBQA="
            },
            json:true,
            resolveWithFullResponse:true
        }).then((response:any)=> console.log(response.responseStartTime-this.checkoutStartedTime)).catch(console.log);
    }
    static GetRegionsInfo = async (): Promise<{
        aoid:string
        city:{
            aoid:string
            role:string
            title:string
        }
        region?:{
            aoid:string
            role:string
            title:string
        }
        district?:{
            aoid:string
            role:string
            title:string
        }
    }[]> => {
        return await request.get("https://api.lamoda.ru/mobile/v1/cities/popular?country=ru", {
            headers: {
                "X-Lm-Country": "ru",
                "X-Lm-Lid": "ZEADoWFPhBt3CmA1C7R5AgA=",
                "X-Lm-Platform": "android_phone",
                "X-Lm-Sessionkey": "ZTE5ZjgzNWE0NGUwNGQ2OGE5NWUzNmJlOWYwM2Y3OGE=|1632603394|b2c9a8aa823bcc164b561cf436e8f5eae1fa9aa6",
                "X-Lm-Sessionsignature": "1f22b45fb2492445990282ff053cb6c4b51f3d3d",
                "X-Newrelic-Id": "UwYOVl5aGwAHVlNUBQA="
            },
            json:true
        }).catch(console.log)
    }
    /* 
    Get delivery price info, using city_aoid
    */
    public GetDeliveryInfo = async (city_aoid: string = "7800000000000"): Promise<LamodaDeliveryTypeInfo[]|undefined> => {
        /* must return interval_id which uses in Checkout method */
        return await request.get(`https://api.lamoda.ru/mobile/v1/delivery/methods?city_aoid=${city_aoid}`, {
            headers: {
                "X-Lm-Country": "ru",
                "X-Lm-Lid": this.Lid,//||"ZEADoWFPhBt3CmA1C7R5AgA=",
                "X-Lm-Platform": "android_phone",
                "X-Lm-Sessionkey": this.Sessionkey,// || "ZTE5ZjgzNWE0NGUwNGQ2OGE5NWUzNmJlOWYwM2Y3OGE=|1632601281|236ed27030a225612eaf61fc74a1157fb26a1170",
                "X-Lm-Sessionsignature": this.Sessionsignature,// || "1f22b45fb2492445990282ff053cb6c4b51f3d3d",
                "X-Newrelic-Id": "UwYOVl5aGwAHVlNUBQA="
            },
            json:true
        }).catch(console.log)
    }
    public GetDeliveryId = async ():Promise<string> => {
        return await request.get(`https://api.lamoda.ru/mobile/v1/delivery/intervals?city_aoid=${this._Address.city_aoid}&house_aoid=${this._Address.house_aoid}&delivery_type=courier&service_level_code=economy&delivery_method_code=${this.delivery_method_code}`, {
            headers: {
                "X-Lm-Country": "ru",
                "X-Lm-Lid": this.Lid,//||"ZEADoWFPhBt3CmA1C7R5AgA=",
                "X-Lm-Platform": "android_phone",
                "X-Lm-Sessionkey": this.Sessionkey,// || "ZTE5ZjgzNWE0NGUwNGQ2OGE5NWUzNmJlOWYwM2Y3OGE=|1632601281|236ed27030a225612eaf61fc74a1157fb26a1170",
                "X-Lm-Sessionsignature": this.Sessionsignature,// || "1f22b45fb2492445990282ff053cb6c4b51f3d3d",
                "X-Newrelic-Id": "UwYOVl5aGwAHVlNUBQA="
            },
            json:true
        }).then((resp:any[])=>{
            return resp[0].intervals[0].id
        }).catch(console.log)
    }
    public Login = async (email:string,password:string): Promise<{
        email:string,
        phone:string,
        password:string
    }|never> => {
        return await request.post("https://api.lamoda.ru/mobile/v1/customer/auth", {
            body: {
                "email":email,
                "password":password
            },
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "X-Lm-Country": "ru",
                "X-Lm-Lid": this.Lid,
                "X-Lm-Platform": "android_phone",
                "X-Lm-Sessionkey": this.Sessionkey,
                "X-Lm-Sessionsignature": this.Sessionsignature,
                "X-Newrelic-Id": "UwYOVl5aGwAHVlNUBQA="
            },
            json:true
        })/* .then(console.log).catch(console.log) */
    }
    static GetCities = async (query: string): Promise<{
        aoid:string
        city:{
            aoid:string
            role:string
            title:string
        }
        region?:{
            aoid:string
            role:string
            title:string
        }
        district?:{
            aoid:string
            role:string
            title:string
        }
    }[]> => {
        return await request.get(`https://api.lamoda.ru/mobile/v1/cities/suggest?query=${encodeURIComponent(query)}&country=ru&cities=true`, {
            headers: {
                "If-Modified-Since": "Sun, 26 Sep 2021 10:36:32 GMT",
                "X-Lm-Country": "ru",
                "X-Lm-Lid": "ZEADnGFQSVdXWlfQFMn4AgA=",
                "X-Lm-Platform": "android_phone",
                "X-Lm-Sessionkey": "NTlmMzY4OGQzNTZlZDI0OGY5MGI2MzVmYzkxODAyNDU=|1632652593|2c3392ef60758f8470abf50b03d95e5e51826fbc",
                "X-Lm-Sessionsignature": "1373af91b4654af149ba5f6155ef3f8d60d6acf1",
                "X-Newrelic-Id": "UwYOVl5aGwAHVlNUBQA="
            },
            json:true
        }).catch(console.log)
    }
    static GetStreets = async (query: string,city_aoid:string): Promise<{
        aoid:string
        street:{
            aoid:string
            role:string
            title:string
        }
    }[]> => {
        return await request.get(`https://api.lamoda.ru/mobile/v1/streets/suggest?city_aoid=${city_aoid}&query=${encodeURIComponent(query)}&limit=10`, {
            headers: {
                "If-Modified-Since": "Sun, 26 Sep 2021 10:36:32 GMT",
                "X-Lm-Country": "ru",
                "X-Lm-Lid": "ZEADnGFQSVdXWlfQFMn4AgA=",
                "X-Lm-Platform": "android_phone",
                "X-Lm-Sessionkey": "NTlmMzY4OGQzNTZlZDI0OGY5MGI2MzVmYzkxODAyNDU=|1632652593|2c3392ef60758f8470abf50b03d95e5e51826fbc",
                "X-Lm-Sessionsignature": "1373af91b4654af149ba5f6155ef3f8d60d6acf1",
                "X-Newrelic-Id": "UwYOVl5aGwAHVlNUBQA="
            },
            json:true
        }).catch(console.log)
    }
    static GetHouses = async (query: string,street_aoid:string): Promise<{
        aoid:string
        house:{
            aoid:string
            role:string
            title:string
        }
    }[]> => {
        return await request.get(`https://api.lamoda.ru/mobile/v1/houses/suggest?street_aoid=${street_aoid}&query=${encodeURIComponent(query)}&limit=10 `, {
            headers: {
                "If-Modified-Since": "Sun, 26 Sep 2021 10:36:32 GMT",
                "X-Lm-Country": "ru",
                "X-Lm-Lid": "ZEADnGFQSVdXWlfQFMn4AgA=",
                "X-Lm-Platform": "android_phone",
                "X-Lm-Sessionkey": "NTlmMzY4OGQzNTZlZDI0OGY5MGI2MzVmYzkxODAyNDU=|1632652593|2c3392ef60758f8470abf50b03d95e5e51826fbc",
                "X-Lm-Sessionsignature": "1373af91b4654af149ba5f6155ef3f8d60d6acf1",
                "X-Newrelic-Id": "UwYOVl5aGwAHVlNUBQA="
            },
            json:true
        }).catch(console.log)
    }

    public GetFullDelivery = async (): Promise<string> => {

        /* must return delivery_method_code 
            used in GetDeliveryId
        */
        return await request.get(`https://api.lamoda.ru/mobile/v1/delivery/methods?city_aoid=${this._Address.city_aoid}&street_aoid=${this._Address.street_aoid}&house_aoid=${this._Address.house_aoid}`, {
            headers: {
                "If-Modified-Since": "Sun, 26 Sep 2021 10:36:32 GMT",
                "X-Lm-Country": "ru",
                "X-Lm-Lid": this.Lid,//||"ZEADoWFPhBt3CmA1C7R5AgA=",
                "X-Lm-Platform": "android_phone",
                "X-Lm-Sessionkey": this.Sessionkey,// || "ZTE5ZjgzNWE0NGUwNGQ2OGE5NWUzNmJlOWYwM2Y3OGE=|1632601281|236ed27030a225612eaf61fc74a1157fb26a1170",
                "X-Lm-Sessionsignature": this.Sessionsignature,// || "1f22b45fb2492445990282ff053cb6c4b51f3d3d",
                "X-Newrelic-Id": "UwYOVl5aGwAHVlNUBQA="
            },
            json:true
        }).then((response:any[])=>{
            const delivery_method_code = response.filter(d=>d.type == 'courier')[0]?.service_levels.filter((level:any)=>level.code == "economy")[0].method_code
            this.delivery_method_code = delivery_method_code
            return delivery_method_code
        }).catch(console.log)
    }
    public startCheckout = async (sku:string):Promise<void>=>{
        this.checkoutStartedTime = Date.now()
        if (this.delivery_method_code.length) {
            await this.AddToCart(sku)
            await this.Checkout()
        } else {
            await this.AddToCart(sku)
            await this.GetFullDelivery()
            await this.Checkout()
        }
    }
}