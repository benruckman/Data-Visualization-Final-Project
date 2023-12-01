class Header extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
    <nav class="navbar">
        <div>
        <ul>
        <li><a class="nav-link" href="index.html">Demo Video</a></li>
        <li><a class="nav-link" href="chess-board.html">Chess Board</a></li>
        <li><a class="nav-link" href="pie-chart.html">Pie Chart</a></li>
        <li><a class="nav-link" href="histogram-chart.html">Histogram</a></li>
        <li><a class="nav-link" href="categorical-bar-chart.html">Bar Chart</a></li>
        </ul>
        </div>

    </nav>`;
  }
}

customElements.define("our-header", Header);
