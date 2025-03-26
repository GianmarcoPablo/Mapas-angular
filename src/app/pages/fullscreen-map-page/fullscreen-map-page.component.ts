import { AfterViewInit, Component, ElementRef, viewChild, signal, effect } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxkey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styles: `
    div {
      width: 100vw;
      height: calc( 100vh - 64px);
    }

    #controls {
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      position: fixed;
      bottom: 25px;
      right: 20px;
      z-index: 9999;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      width: 250px;
    }
  `,
})
export class FullscreenMapPageComponent implements AfterViewInit {

  divElement = viewChild<ElementRef>('map'); // Signal de Angular 17
  map = signal<mapboxgl.Map | null>(null)
  zoom = signal(14)

  cordinates = signal({
    lng: -78.2460,
    lat: -6.8849
  })

  zoomEffect = effect(() => {
    if (!this.map) return
    this.map()?.setZoom(this.zoom())
  })

  ngAfterViewInit() {
    if (!this.divElement()) return; // Acceder al valor del signal


    const element = this.divElement()?.nativeElement;

    if (!element) return;

    const { lat, lng } = this.cordinates()

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lat, lng],
      zoom: this.zoom(),
    });

    this.mapListeners(map)
  }

  mapListeners(map: mapboxgl.Map) {
    map.on("zoomend", (e) => {
      const newZoom = e.target.getZoom()
      this.zoom.set(newZoom)
    })

    map.on("moveend", () => { 
      const center  = map.getCenter();
      this.cordinates.set(center)
    })

    map.addControl(new mapboxgl.FullscreenControl())

    this.map.set(map)
  }
}
