import ListIcon from 'react-icons/lib/fa/list-ul'

export default ({ Icon = ListIcon, children }) =>
    <div className="popover__wrapper">

        <a href="#">
            <span className="popover__title">
                <Icon />
            </span>
        </a>
        <div className="push popover__content">
            {children}
        </div>

        <style jsx>{`
        a {
            text-decoration: none;
          }

        .popover__title {
            text-decoration: none;
            color: #0074D9;
            padding: 5px 0;
            margin-left: 10px;
          }

          .popover__wrapper {
              position: relative;
            //   margin-top: 1.5rem;
              display: inline-block;
          }
          .popover__content {
              opacity: 0;
              visibility: hidden;
              position: absolute;
              left: 50%;
              top: 0;
              transform: translate(-50%, -20px);
              background-color: #fff;
              padding: 1.5rem;
              box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
              width: 640px;
          }
          .popover__content:before {
              position: absolute;
              z-index: -1;
              content: '';
              right: calc(50% - 10px);
              top: -8px;
              border-style: solid;
              border-width: 0 10px 10px 10px;
              border-color: transparent transparent #ddd transparent;
              transition-duration: 0.3s;
              transition-property: transform;
          }
          .popover__wrapper:hover .popover__content {
              z-index: 10;
              opacity: 1;
              visibility: visible;
              transform: translate(-50%, 30px);
              transition: all 0.5s cubic-bezier(0.75, -0.02, 0.2, 0.97);
          }
          .popover__message {
            text-align: center;
          }
      `}</style>
    </div>
