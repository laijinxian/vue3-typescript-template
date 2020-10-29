import { Component } from 'vue'

export interface IRouter {
  path: string,
  name: string,
  component: Component
}