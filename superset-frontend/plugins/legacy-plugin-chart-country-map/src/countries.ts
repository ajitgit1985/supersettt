/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import india from './countries/india.geojson';
import north_east_region from './countries/doner.geojson';
import andhra_pradesh from './countries/andhrapradesh.geojson';
import andaman_nicobar from './countries/andaman_nicobar.geojson';
import rajasthan from './countries/rajasthan.geojson';
import himachal_pradesh from './countries/himachalpradesh.geojson';
import karnataka from './countries/karnataka.geojson';
import goa from './countries/goa.geojson';
import tamil_nadu from './countries/tamilnadu.geojson';
import jammu_and_kashmir from './countries/jammu_and_kashmir.geojson';
import jharkhand from './countries/jharkhand.geojson';
import uttarakhand from './countries/uttarakhand.geojson';
import bihar from './countries/bihar.geojson';
import chhattisgarh from './countries/chhattisgarh.geojson';
import chandigarh from './countries/chandigarh.geojson';
import kerala from './countries/kerala.geojson';
import gujarat from './countries/gujarat.geojson';
import madhya_pradesh from './countries/madhyapradesh.geojson';
import manipur from './countries/manipur.geojson';
import mizoram from './countries/mizoram.geojson';
import ladakh from './countries/ladakh.geojson';
import odisha from './countries/odisha.geojson';
import punjab from './countries/punjab.geojson';
import puducherry from './countries/puducherry.geojson';
import sikkim from './countries/sikkim.geojson';
import uttar_pradesh from './countries/uttarpradesh.geojson';
import west_bengal from './countries/westbengal.geojson';
import tripura from './countries/tripura.geojson';
import meghalaya from './countries/meghalaya.geojson';
import arunachal_pradesh from './countries/arunachalpradesh.geojson';
import assam from './countries/assam.geojson';
import maharashtra from './countries/maharashtra.geojson';
import telangana from './countries/telangana.geojson';
import haryana from './countries/haryana.geojson';
import lakshwdweep from './countries/lakshwdweep.geojson';
import delhi from './countries/delhi.geojson';
import daman from './countries/daman.geojson';
import nagaland from './countries/nagaland.geojson';

export const selectCountryDefault: { [key: string]: string | null } = {};

document.addEventListener('stateClicked', (event: CustomEvent) => {
  const stateISO = event.detail.stateISO;
  if (stateISO) {
    selectCountryDefault[stateISO] = stateISO;
  }
});

export const countries = {
  india,
  north_east_region,
  andhra_pradesh,
  andaman_nicobar,
  arunachal_pradesh,
  assam,
  bihar,
  chhattisgarh,
  chandigarh,
  goa,
  gujarat,
  haryana,
  himachal_pradesh,
  jharkhand,
  karnataka,
  kerala,
  madhya_pradesh,
  maharashtra,
  manipur,
  meghalaya,
  mizoram,
  ladakh,
  odisha,
  punjab,
  puducherry,
  rajasthan,
  sikkim,
  tamil_nadu,
  jammu_and_kashmir,
  telangana,
  tripura,
  uttarakhand,
  uttar_pradesh,
  west_bengal,
  lakshwdweep,
  delhi,
  daman,
  nagaland,
};

export const countryOptions = Object.keys(countries).map(x => {
  // console.log("country_store");
  if (x === 'uk' || x === 'usa') {
    return [x, x.toUpperCase()];
  }
  if (x === 'italy_regions') {
    return [x, 'Italy (regions)'];
  }

  const formattedX = x
    .replace(/_/g, ' ')
    .replace(
      /(\w)(\w*)/g,
      (match, p1, p2) => p1.toUpperCase() + p2.toLowerCase(),
    );
  return [x, formattedX];
});

export default countries;
