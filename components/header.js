class Header extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
    <nav class="navbar">
        <div>
        <ul>
        <li><a href="/">Dashboard</a></li>
        <li><a class="nav-link" href="#chess-board">Chess Board</a></li>
        <li><a class="nav-link" href="#pie-chart">Pie Chart</a></li>
        <li><a class="nav-link" href="#HistogramChart-div">Histogram</a></li>
        <li><a class="nav-link" href="#CategoricalBarChart-div">Bar Chart</a></li>
        </ul>
        </div>

    </nav>`;
  }
}

customElements.define("our-header", Header);
