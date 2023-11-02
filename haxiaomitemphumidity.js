class XioamiTempHumCard extends HTMLElement {

  // private properties

  _config;
  _hass;
  _elements = {};
  _dataXTH = {};
  _isAttached = false;

  // lifecycle
  constructor() {
      super();
      console.log("XioamiTempHumCard.constructor()")
      this.doStyle();
      this.loadcss();
      this.doCard();
  }

  setConfig(config) {
      console.log("XioamiTempHumCard.setConfig()")
      this._config = config;
      if (!this._isAttached) {
          this.doAttach();
          this.doQueryElements();
          //this.doListen();
          this._isAttached = true;
      }
      this.doCheckConfig();
      this.doUpdateConfig();
  }

  set hass(hass) {
      console.log("XioamiTempHumCard.hass()")
      this._hass = hass;
      this.doUpdateHass()
  }

  connectedCallback() {
      console.log("XioamiTempHumCard.connectedCallback()")
  }

  onClicked() {
      console.log("XioamiTempHumCard.onClicked()");
      this.doToggle();
  }

  // accessors
  isOff() {
      return this.getState().state == 'off';
  }

  isOn() {
      return this.getState().state == 'on';
  }

  getHeader() {
      return this._config.header;
  }

  getEntityID() {
      return this._config.entity;
  }

  getState() {
      return this._hass.states[this.getEntityID()];
  }

  getAttributes() {
      return this.getState().attributes
  }

  getName() {
      const friendlyName = this.getAttributes().friendly_name;
      return friendlyName ? friendlyName : this.getEntityID();
  }


  // jobs
  doCheckConfig() {
      if (!this._config.entities) {
          throw new Error('Please define at least two entities!');
      }
  }
  loadcss() {
    let css = '/local/haxiaomitemphumidity/haxiaomitemphumidity.css?v=0.005'

    let link = document.createElement('link');
    let head = document.getElementsByTagName('head')[0];
    let tmp;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    tmp = link.cloneNode(true);
    tmp.href = css;
    head.appendChild(tmp);
    console.info('%c Font Style sheet loaded', 'color: white; background: #000; font-weight: 700;');

    }
  doStyle() {
      this._elements.style = document.createElement("style");
      this._elements.style.textContent = `
      
    
    
      .xth-container{
        font-family: 'Seven Segment';
      }
      .xth-row{
        display:block;
        clear:both;
        text-align:center;
      }

      .xth-TempData{
        font-size: 3.5rem;
        display:inline-block;
      }
      .xth-TempDataUM{
        font-size: 1.5rem;
        display:inline-block;
      }
      .xth-humiData{
        font-size:2rem;
        display:inline-block;
      }
      .xth-humiDataUM{
        font-size:1rem;
        display:inline-block;
      }
      .xth-emotionlocation{
        font-family: monospace;
        font-size:1.5rem;
        display:inline-block;
      }
      .xth-nombre
      {
        font-size:1rem;
      }
      .xth-mt-1{
        margin-top:1rem
      }

      @media (max-width: 575.98px) { 
        .xth-TempData{
          font-size: 3rem;
          display:inline-block;
        }
        .xth-TempDataUM{
          font-size: 1.5rem;
          display:inline-block;
        }
    
      }
      `
  }

  doCard() {
      this._elements.card = document.createElement("ha-card");
      this._elements.card.innerHTML = `
              <div class="card-content xth-container">
              <div class="xth-row">
              <div class="xth-error"></div>
              </div>
              <div class="xth-row">
              <div class="xth-nombre"></div>
              </div>
              <div class="xth-row xth-mt-1">
              <div class="xth-TempData"></div>
              <span class="xth-TempDataUM"></span>
            </div>
            <div class="xth-row xth-mt-1">
              <div class="xth-emotionlocation" >
              <!--<ha-icon class="xth-emotion"  icon=""></ha-icon>-->
              </div>

              <div class="xth-humiData"></div>
              <span class="xth-humiDataUM"></span>
            </div>
              </div>
      `;
  }

  doAttach() {
      this.append(this._elements.style, this._elements.card);
  }

  doQueryElements() {
      const card = this._elements.card;
      this._elements.error = card.querySelector(".xth-error")
      this._elements.nombre = card.querySelector(".xth-nombre")
      this._elements.temperatureData = card.querySelector(".xth-TempData")
      this._elements.temperatureDataUM = card.querySelector(".xth-TempDataUM")
      this._elements.emotionlocation = card.querySelector(".xth-emotionlocation")
      //this._elements.emotion = card.querySelector(".xth-emotion")
      this._elements.humiData = card.querySelector(".xth-humiData")
      this._elements.humiDataUM = card.querySelector(".xth-humiDataUM")
  }

  /*doListen() {
      this._elements.dl.addEventListener("click", this.onClicked.bind(this), false);
  }*/

  doUpdateConfig() {
      if (this.getHeader()) {
          this._elements.card.setAttribute("header", this.getHeader());
      } else {
          this._elements.card.removeAttribute("header");
      }
  }

  doUpdateHass() {
      /*if (!this.getState()) {
          this._elements.error.textContent = `${this.getEntityID()} is unavailable.`;
          this._elements.error.classList.remove("xth-error--hidden");
          //this._elements.dl.classList.add("xth-dl--hidden");
      } else {
        */
        console.log(this._hass);

        this._config.entities.map((ent) => {
          console.log(ent);
          var entattr = this._hass.states[ent].attributes;
          if (ent.includes("temperature")) {
            this._dataXTH.temperature = parseFloat(entattr.median).toFixed(1);
            this._dataXTH.temperatureUM = entattr.unit_of_measurement;
          } else if (ent.includes("humidity")) {
            this._dataXTH.humidity = parseFloat(entattr.median).toFixed(1);
            this._dataXTH.humidityUM = (entattr.unit_of_measurement);
          }
          console.log(this._hass.states[ent]);
        });
    
        console.log(this._dataXTH);
        this._dataXTH.emotion = 'mdi:emoticon-sad-outline';
        this._dataXTH.emotionstatus = 'xth-sad';
        console.log("Sensor");
        console.log(this._dataXTH);
        console.log(this._dataXTH.humidity);
        this._dataXTH.emotionIcon ="😞";
        if (this._dataXTH.temperature >= 19.0 && this._dataXTH.temperature <= 27.0 && this._dataXTH.humidity >= 20.0 && this._dataXTH.humidity <= 85.0) {
          this._dataXTH.emotion = 'mdi:emoticon-happy-outline';
          this._dataXTH.emotionstatus = "xth-happy";
          this._dataXTH.emotionIcon ="🙂";
          
        }
        console.log(this._dataXTH.icon);
        console.log("!Sensor");
        this._elements.error.textContent = "";

        this._elements.temperatureData.textContent =  this._dataXTH.temperature;
        this._elements.temperatureDataUM.textContent =  this._dataXTH.temperatureUM;
         
        this._elements.nombre.textContent =  this._config.name;
        this._elements.humiData.textContent =  this._dataXTH.humidity;
        this._elements.humiDataUM.textContent =  this._dataXTH.humidityUM;
        console.log("this._elements.emotionlocation");
        console.log(this._elements.emotionlocation);
        console.log("!this._elements.emotionlocation");
        this._elements.emotionlocation.innerHTML=this._dataXTH.emotionIcon;
        //this._elements.emotionlocation.classList.remove("xth-sad","xth-hapy")
        //this._elements.emotionlocation.classList.add(this._dataXTH.emotionstatus)
        //this._elements.emotion.icon =     this._dataXTH.emotion;
        //this._elements.emotionlocation = card.querySelector(".xth-emotionlocation")
        //this._elements.humiData = card.querySelector(".xth-humiData")

      /*
    }
      */
  }

  doToggle() {
      this._hass.callService('input_boolean', 'toggle', {
          entity_id: this.getEntityID()
      });
  }

  // configuration defaults
  static getStubConfig() {
      return { entity: "input_boolean.xth" }
  }

}

customElements.define('xiaomi-temp-humidity', XioamiTempHumCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "xiaomi-temp-humidity",
  name: "Vanilla Js Toggle",
  description: "Turn an entity on and off"
});