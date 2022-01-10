import { store } from "../../store";
import { ProfileInterface } from "../../Interfaces/interfaces";
import { EDIT_RAFFLE_STATE } from "../../store/raffleReducer";
const cheerio = require('cheerio')
const request = require('cloudscraper')
// request.debug = true
const getProxy = (proxyProfile:string):string[]=>store.getState().proxy[proxyProfile].proxy
const changeProxy = ()=>{
    let i = 0
    return (proxyProfile:string = 'noProxy')=>{
        const proxies = getProxy(proxyProfile||"noProxy")
        i>=proxies.length?i=0:i++
        return proxies[i]
    }
}



const Change = changeProxy()
const getProfile = (profile:string):ProfileInterface=>store.getState().profiles[profile]
const getAccountsProfile = (profile:string)=>store.getState().accounts[profile]
const editCheckoutState = (status:'success'|'fail',id:string)=>store.dispatch({type:EDIT_RAFFLE_STATE,payload:{status,id}})


export class TravisRaffle{
    private form:{
        action?:string,
        email?:string,
        first?:string,
        last?:string,
        zip?:string,
        telephone?:string,
        product_id?:string|number,
        kind?:string,
        size?:string|number
    } = {
        action:'',
        email:'',
        first:'',
        last:'',
        zip:'',
        telephone:'',
        product_id:'',
        kind:'',
        size:''
    }
    public accountsProfile
    public proxyProfile
    public profile
    private stop = false
    readonly id
    readonly delay
    private _i=0
    constructor(accountsProfile:string,proxyProfile:string,profile:string,id:string,delay:number){
        this.accountsProfile = accountsProfile
        this.proxyProfile = proxyProfile
        this.profile = profile
        this.id = id
        this.delay=delay
        this.ParseForm()
    }
    /**
     * ParseForm
     */
    public async ParseForm() {
        try {
            let $ = cheerio.load(await request.get('https://shop.travisscott.com/'))
            let form = $('.js-raf')
            if(!form.attr('action')?.length) return
            this.form = {
                action:form.attr('action')
            }
            $('.js-raf').find('.js-vals').toArray().forEach((e:any) => {
                this.form = {
                    ...this.form,
                    [$(e).attr('name')]: $(e).val()
                }
            })            
        } catch (error) {
            console.log(error)
        }
        return this.sendForm()
    }
    /**
     * sendForm
     */
    
    public set setStop(stop: boolean) {
        this.stop = stop ;
    }
    
    public async sendForm() {
        // request.debug=true

        const email = getAccountsProfile(this.accountsProfile)[this._i]
        if(this.stop)return
        try {
            await request.get(this.form.action!.replace("submission", "submit").concat("?a=m")+`&email=${email}&first=${getProfile(this.profile).firstName}&last=${getProfile(this.profile).lastName}&zip=${getProfile(this.profile).postCode}&telephone=${getProfile(this.profile).phone}&product_id=${this.form.product_id}&kind=${this.form.kind}&size=${9}`,{
                proxy:Change(this.proxyProfile)
            })
            .then(()=>{
                console.log('success')
                editCheckoutState('success',this.id)
            })
            .catch((e:any)=>{
                console.log(e)
                editCheckoutState('fail',this.id)
            })
        } catch (error) {
            console.log(error)
            editCheckoutState('fail',this.id)
        }
        this._i++
        setTimeout(()=>this.sendForm(),this.delay)               

    }

} 

