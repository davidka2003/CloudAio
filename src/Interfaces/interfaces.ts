import { TravisRaffle } from '../scripts/raffles/travis';
import { Lamoda } from '../scripts/lamoda/lamoda';
import { LamodaMonitor } from '../scripts/lamoda/lamodaMonitor';
export interface ActionInterface {
  type: string;
  payload: any;
}

export interface ProxyProfileInterface {
  profileName: string | 'noProxy';
  proxy: string[];
}
export interface ProfileInterface {
  profileName: string;
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  province: string;
  postCode: string;
  cardNumber: string;
  cardHolderName: string;
  month: string;
  year: string;
  cvv: string;
  phone: string;
} /* Removed ? */
export interface RaffleTaskInterface {
  isCustomSizes?: boolean;
  sizes?: {
    [size: string]: boolean;
  };
  __taskNumber: number;
  profile: string;
  accountProfile: string;
  checked: boolean;
  id: string;
  task: TravisRaffle | null;
  status: {
    success: number;
    fail: number;
  };
  isRun: boolean;
  shopType: 'travis';
  proxyProfile: string;
  delay: number;
}

export interface SettingsInterface {
  captchaKey: string;
  discordWebhook: string;
  monitorsDelay: number;
  monitorProxyProfile: string;
}

export interface LamodaRegionInfo {
  aoid: '7700000000000';
  city: {
    aoid: '7700000000000';
    role: 'city';
    title: 'г. Москва';
  };
  region: {
    aoid: '7700000000000';
    role: 'city';
    title: 'г. Москва';
  };
}

export interface LamodaDeliveryTypeInfo {
  service_levels: {
    code: 'plus';
    delivery_date_max: '2021-09-27T00:00:00.000Z';
    delivery_date_min: '2021-09-27T00:00:00.000Z';
    delivery_price: 0;
    description: 'Доставка бесплатная, вне зависимости от суммы покупки.';
    has_intervals: true;
    interval_duration: 'default';
    is_bankcard_accepted: true;
    is_lme: true;
    is_tryon_allowed: true;
    method_code: 'lamoda_showroom_spb_babushkina14';
    title: 'С примеркой';
    tryon_limit_from: 10;
    tryon_limit_to: 10;
  }[];
  title: 'Самовывоз';
  type: 'pickup';
}
interface Task {
  shop: string;
  taskId: string;
  proxyProfile: string;
  profile: string;
}
export interface LamodaTaskInterface extends Task {
  shop: 'lamoda';
  sizes: string[];
  pids: string[];
  address: {
    region: string;
    region_aoid: string;
    city: string;
    city_aoid: string;
    street: string;
    street_aoid: string;
    house_aoid: string;
    house_number: string;
    apartment: string;
  };
  currentCheckoutState: {
    state: string;
    level: 'LOW' | 'ERROR' | 'SUCCESS';
  };
  delivery: {
    type: 'courier';
    service_level_code: string;
    delivery_method_code: string;
    interval_id: string;
  };
  /* INIT at start add all information for page reload in localstorage */
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string /* get from @Lamoda.Login */;
  };
  checkout: InstanceType<typeof Lamoda> | null;
}

export interface MonitorsInterface {
  lamoda: InstanceType<typeof LamodaMonitor> | null;
}
