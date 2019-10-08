package controllers

import akka.stream.scaladsl._
import javax.inject._
import play.api.Logger
import play.api.mvc._

import scala.concurrent.ExecutionContext

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject()(cc: ControllerComponents)
                              (implicit ec: ExecutionContext)
  extends AbstractController(cc) with SameOriginCheck {

  val logger = play.api.Logger(getClass)

  /**
    * Create an Action to render an HTML page.
    *
    * The configuration in the `routes` file means that this method
    * will be called when the application receives a `GET` request with
    * a path of `/`.
    */
  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  def socket = WebSocket.accept[String, String] { request =>

    val in = Sink.foreach[String](println)

    val out = Source.single("Hello!").concat(Source.maybe)

    Flow.fromSinkAndSource(in, out)
  }


}

trait SameOriginCheck {

  def logger: Logger

  /**
    * Checks that the WebSocket comes from the same origin.  This is necessary to protect
    * against Cross-Site WebSocket Hijacking as WebSocket does not implement Same Origin Policy.
    *
    * http://blog.dewhurstsecurity.com/2013/08/30/security-testing-html5-websockets.html
    */
  def sameOriginCheck(rh: RequestHeader): Boolean = {
    rh.headers.get("Origin") match {
      case Some(originValue) if originMatches(originValue) =>
        logger.debug(s"originCheck: originValue = $originValue")
        true

      case Some(badOrigin) =>
        logger.error(s"originCheck: rejecting request because Origin header value ${badOrigin} is not in the same origin")
        false

      case None =>
        logger.error("originCheck: rejecting request because no Origin header found")
        false
    }
  }

  /**
    * Returns true if the value of the Origin header contains an acceptable value.
    *
    * This is probably better done through configuration same as the allowedhosts filter.
    *
    */
  def originMatches(origin: String): Boolean = {
    //TODO move this to the configuration
    origin.contains("localhost:9000") || origin.contains("localhost:19001")
  }
}
