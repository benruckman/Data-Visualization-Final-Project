class Header extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
    <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
        <div>
        <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="/">Dashboard</a>
        <a class="nav-link" href="visualizations.html">Chess Board</a>
        <a class="nav-link" href="visualizations.html">Pie Chart</a>
        <a class="nav-link" href="visualizations.html">Histogram</a>
        <a class="nav-link" href="visualizations.html">Bar Chart</a>
        </div>
    </nav>`;
  }
}

customElements.define("our-header", Header);
