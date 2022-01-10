const request = require('cloudscraper')
import React, { useEffect,useState } from 'react'
import './calendar.global.scss'

const Calendar = () => {
  const [items, setitems] = useState<any>([])
  useEffect(()=>{
    request.get("https://sneakernews.com/wp-admin/admin-ajax.php?action=release_date_load_more&nextpage=2&category_name=sneaker-release&start_from=0",{
      headers:request.defaultParams.headers
      }).then(
      (resp:string)=>request.get("https://sneakernews.com/wp-admin/admin-ajax.php?action=release_date_load_more&nextpage=3&category_name=sneaker-release&start_from=0",{
        headers:request.defaultParams.headers
        }).then((response:string)=>{
        response = resp+response
        let Items:any[] =[] 
        let doc = new DOMParser().parseFromString(response,'text/html')
        doc.querySelectorAll('.releases-box[id]').forEach((element:any)=>{
          Items=[...Items,{
            img:element.querySelector('img').src,
            price:element.querySelector('.release-price').textContent.replace(/\s+/g," ").trim(),
            date:element.querySelector('.release-date').textContent.replace(/\s+/g," ").trim(),
            name:element.querySelector('.content-box').querySelector('h2').querySelector('a').textContent.replace(/\s+/g," ").trim(),
            sizes:element.querySelector('.post-data').querySelectorAll('p')[0].textContent.replace(/\s+/g," ").trim(),
            color:element.querySelector('.post-data').querySelectorAll('p')[1].textContent.replace(/\s+/g," ").trim(),
            styleCode:element.querySelector('.post-data').querySelectorAll('p')[2].textContent.replace(/\s+/g," ").trim(),
            regions:element.querySelector('.post-data').querySelectorAll('p')[3].textContent.replace(/\s+/g," ").trim(),
          }]
        })
        return setitems(Items)

      }).catch(console.log)
    ).catch(console.log)
    },[])
    return (
<div className="tab-pane fade" id="v-pills-calendar" role="tabpanel" aria-labelledby="v-pills-calendar-tab">
  <div className="container">
    <div className="row g-4">
      {items.map((element:any,index:number)=>      <div key={index} className="col-4">
        <div className="p-3 custom-corners custom_card">
          <img src={element.img} className="rounded calendarImg" alt="..." />
          <div className="container">
            <h3 id="date">{element.date}</h3>
            <h6 id="сolorName">{element.name}</h6>
            <h4 id="price">{element.price}</h4>
          </div>
          <div className="container">
            <h5 id="styleCode">{element.styleCode}</h5>
            <br />
            <h5 id="region">{element.regions}</h5>
          </div>
        </div>
      </div>
)}
    </div>
  </div>
</div>
    )
}

export default Calendar
